var GIPHY_API_URL = 'https://cors-anywhere.herokuapp.com/https://api.giphy.com';
var GIPHY_PUB_KEY = 'gHCn0ghxMnPbwQcr2TLDfO202Rb361Sj';

App = React.createClass({
   getInitialState() {
      return {
         loading: false,
         searchingText: '',
         gif: {}
      };
   },

   handleSearch: function(searchingText) {
      this.setState({
         loading: true
      });
      this.getGif(searchingText)
         .then(gif => {
            this.setState({
               loading: false,
               gif: gif,
               searchingText: searchingText
            });
         })
         .catch(error => console.error('Wrong turn !', error));
   },

   getGif: function(searchingText) {
      return new Promise((resolve, reject) => {
         var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
         var xhr = new XMLHttpRequest();
         xhr.open('GET', url);
         xhr.onload = () => {
            if (xhr.status === 200) {
               var data = JSON.parse(xhr.responseText).data;
               if (data.type === 'gif') {
                  var gif = {
                     url: data.fixed_width_downsampled_url,
                     sourceUrl: data.url
                  };
                  resolve(gif);
               } else {
                  reject(new Error(this.statusText));
               }
            }
         };
         xhr.onerror = () => {
            reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
         };
         xhr.send();
      });
   },

   render: function() {
      var styles = {
         margin: '0 auto',
         textAlign: 'center',
         width: '90%'
      };

      return (
         <div style={styles}>
            <h1> GIF's search</h1>
            <p>
               {' '}
               Find gif on <a href='http://giphy.com'>giphy</a>. Press enter to get more gif's.
            </p>
            <Search onSearch={this.handleSearch} />
            <Gif loading={this.state.loading} url={this.state.gif.url} sourceUrl={this.state.gif.sourceUrl} />
         </div>
      );
   }
});
