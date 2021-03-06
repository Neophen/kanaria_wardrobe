<script>
function randomString(length) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '1234567890';
  const charset = `${letters}${letters.toUpperCase()}${numbers}`;

  const randomCharacter = (character) =>
    character[Math.floor(Math.random() * character.length)];

  let R = '';
  for (let i = 0; i < length; i++) {
    R += randomCharacter(charset);
  }

  return R;
}

import { h } from 'vue';

let id = 1;

/**
 * Remove false attrs
 * @param {Object} attrs
 */
function filterAttrs(attrs) {
  return Object.keys(attrs).reduce((result, key) => {
    if (
      attrs[key] !== false &&
      attrs[key] !== null &&
      attrs[key] !== undefined
    ) {
      result[key] = attrs[key];
    }
    return result;
  }, {});
}

export function removeProperties(input, ...filter) {
  const output = {};

  for (const key in input) {
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes(key)) {
        output[key] = input[key];
      }
    }
  }

  return output;
}

export default {
  name: 'InlineSvg',
  inheritAttrs: false,
  render() {
    if (!this.svgElSource) {
      return null;
    }

    const svgAttrs = {
      ...this.getSvgAttrs(this.svgElSource),
      ...filterAttrs(this.$attrs),
      innerHTML: this.getSvgContent(this.svgElSource),
      id: id,
    };

    const elementProps = removeProperties(
      svgAttrs,
      'baseURL',
      'cacheRequests',
      'children',
      'description',
      'fetchOptions',
      'innerRef',
      'loader',
      'onError',
      'onLoad',
      'preProcessor',
      'src',
      'title',
      'uniqueHash',
      'uniquifyIDs'
    );

    id += 1;

    return h('svg', elementProps);
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    preProcessor: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      /** @type SVGElement */
      svgElSource: null,
      hash: randomString(10),
    };
  },
  watch: {
    src(newValue) {
      // re-generate cached svg (`svgElSource`)
      this.getSource(newValue);
    },
  },
  mounted() {
    // generate `svgElSource`
    this.getSource(this.src);
  },
  methods: {
    updateSVGAttributes(node) {
      const baseURL = '';
      const replaceableAttributes = [
        'id',
        'href',
        'xlink:href',
        'xlink:role',
        'xlink:arcrole',
      ];
      const linkAttributes = ['href', 'xlink:href'];
      const isDataValue = (name, value) =>
        linkAttributes.indexOf(name) >= 0 &&
        (value ? value.indexOf('#') < 0 : false);

      [...node.children].map((d) => {
        if (d.attributes && d.attributes.length) {
          const attributes = Object.values(d.attributes).map((a) => {
            const attr = a;
            const match = a.value.match(/url\((.*?)\)/);

            if (match && match[1]) {
              attr.value = a.value.replace(
                match[0],
                `url(${baseURL}${match[1]}__${this.hash})`
              );
            }

            return attr;
          });

          replaceableAttributes.forEach((r) => {
            const attribute = attributes.find((a) => a.name === r);

            if (attribute && !isDataValue(r, attribute.value)) {
              attribute.value = `${attribute.value}__${this.hash}`;
            }
          });
        }

        if (d.children.length) {
          return this.updateSVGAttributes(d);
        }

        return d;
      });

      return node;
    },
    getSvgAttrs(svgEl) {
      // copy attrs
      let svgAttrs = {};
      const attrs = svgEl.attributes;
      if (!attrs) {
        return svgAttrs;
      }
      for (let i = attrs.length - 1; i >= 0; i--) {
        svgAttrs[attrs[i].name] = attrs[i].value;
      }
      return svgAttrs;
    },
    getSvgContent(svgEl) {
      const node = svgEl.cloneNode(true);
      // copy inner html

      const preProcessor = this.preProcessor;
      if (preProcessor) {
        return preProcessor(node.innerHTML);
      }
      return node.innerHTML;
    },
    /**
     * Get svgElSource
     * @param {string} src
     */
    async getSource(src) {
      try {
        const svg = await this.download(src);
        // inline svg when cached promise resolves
        const element = this.updateSVGAttributes(svg);
        this.svgElSource = element;
      } catch (error) {
        console.log('failed to load: ', src);
      }
    },

    /**
     * Get the contents of the SVG
     * @param {string} url
     * @returns {Promise<Element>}
     */
    async download(url) {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            try {
              // Setup a parser to convert the response to text/xml in order for it to be manipulated and changed
              const parser = new DOMParser();
              const result = parser.parseFromString(
                request.responseText,
                'text/xml'
              );
              let svgEl = result.getElementsByTagName('svg')[0];
              if (svgEl) {
                // svgEl = this.transformSource(svgEl);
                resolve(svgEl);
              } else {
                reject(new Error('Loaded file is not valid SVG"'));
              }
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error('Error loading SVG'));
          }
        };

        request.onerror = reject;
        request.send();
      });
    },
  },
};
</script>
