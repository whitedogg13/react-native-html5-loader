import React, {Component} from 'react'

const webApp = head => body => app =>`
<html>
  <head>
    ${head}
  </head>

  <body>
    <script>
      window.callRN = function(type, payload) {
          window.postMessage(JSON.stringify({type: type, payload: payload}));
      };

      window.addEventListener('error', function(message, source, line, col, error) {
        callRN('__err__', {
            message: message, source: source, line: line, col: col, error: error,
        });
      });

      document.addEventListener('message', function(event) {
          try {
              var action = JSON.parse(event.data);
              if (action.type === '__init__') {
                  callRN('__init__', null);
              }
    
              main(action, callRN, window);
          } catch (ex) {
              callRN('__ex__', ex);
          }
      });
    </script>

    ${body}

    <script>
      window.main = ${app}
    </script>
  </body>
</html>
`;

function _validateProps(props) {
    let { rnHandler, webHandler } = props;
    if (!rnHandler || typeof (rnHandler) !== 'function') {
        throw new Error('prop rnHandler should be a function');
    }

    if (!webHandler || typeof (webHandler) !== 'function') {
        throw new Error('prop webHandler should be a function');
    }
}

class Html5Loader extends Component {
    componentWillMount() {
        _validateProps(this.props);

        let {head='', body='', webHandler} = this.props;
        this.html = webApp(head)(body)(webHandler.toString());
        console.log(this.html);
    }

    render() {
        let webViewProps = {
            ref: this._onRef,
            onMessage: this._onMessage,
            originWhitelist: ['*'],
            source: {
                html: this.html, 
                baseUrl: ''
            }
        }

        return this.props.children({
            callWeb: this._callWeb,
            webViewProps,
        })
    }

    _onRef = ref => {
        this.ref = ref;
        this.timer = setInterval(() => {
            this._callWeb('__init__', null)
        }, 100);
    }

    _onMessage = event => {
        let {rnHandler} = this.props;

        try {
            let action = JSON.parse(event.nativeEvent.data);

            if (action.type === '__init__') {
                clearInterval(this.timer);
                this.timer = null;
            }

            rnHandler && rnHandler(action, this._callWeb);
        } catch (ex) {
            console.warn(ex);
        }
    }

    _callWeb = (type, payload) => {
        if (this.ref) {
            this.ref.postMessage(JSON.stringify({type, payload}))
        }
    }
}

export default Html5Loader;