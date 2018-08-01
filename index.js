import React, {Component} from 'react'
import {
    WebView
} from 'react-native'

const webApp = head => body => app =>`
<html>
  <head>
    ${head}
  </head>

  <body>
    ${body}

    <script>
      window.callRN = function(type, payload) {
          window.postMessage(JSON.stringify({type: type, payload: payload}));
      };

      window.onerror = function(message, url, line, column, error) {
        callRN('__err__', {message: message, url: url, line: line, column: column});
      };
    
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

      window.main = ${app}
    </script>
  </body>
</html>
`;

class WebLoaderView extends Component {
    componentWillMount() {
        let {head='', body='', webHandler} = this.props;
        this.html = webApp(head)(body)(webHandler.toString());
    }

    render() {
        let {webViewProps={}} = this.props;
        return (
            <WebView 
                {...webViewProps}
                ref={this._onRef}
                onMessage={this._onMessage}
                originWhitelist={['*']} 
                source={{
                    html: this.html, baseUrl: ''
                }}
            >
                {this.props.children}
            </WebView>
        )
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
            console.log(action);

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

export default WebLoaderView;