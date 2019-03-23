console.log('testestest')

var data 
var request = new XMLHttpRequest();
request.open('GET', 'http://chart.kyleclapper.com:8333/chartArtist', false)
request.onload = function() {
  var content = Object.values(JSON.parse(this.response))
  data = content
}
request.send()

function checkChart(artist) {
  if(typeof artist != 'string'){
      artist = artist.toString()
  }

  for(item of data) {
      if(item.artist.replace(/ /g, '').toLowerCase() == artist.replace(/ /g, '').toLowerCase()){
          return true
      }
  }
  return false
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  charted: false,
                    test: 'string',
                    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({charted: checkChart(event.target.value)});

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var returnString = '';
    if(this.state.charted) {
      returnString = 'This band HAS CHARTED. You CANNOT play them.'
    }
    if(!this.state.charted) {
      returnString = 'This band has not charted. You can play them.'
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <br />
        {returnString}
      </form>
      </div>
    );
  }
}

let domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<LikeButton />, domContainer);