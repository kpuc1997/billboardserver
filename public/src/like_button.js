var data 
var request = new XMLHttpRequest();
request.open('GET', 'http://chart.kyleclapper.com/chartArtist', false)
request.onload = function() {
  var content = Object.values(JSON.parse(this.response))
  data = content
}
request.send()

function checkChart(artist) {
  if(typeof artist != 'string'){
      artist = artist.toString()
  }

  var exactList= [];
  var partList= [];
  if(artist.replace(/ /g, '') == ''){
    return [exactList, partList]
  }

  for(item of data) {
      if(item.artist.replace(/ /g, '').toLowerCase() == artist.replace(/ /g, '').toLowerCase()){
          exactList.push(item)
      }
      if(item.artist.replace(/ /g, '').toLowerCase().includes(artist.replace(/ /g, '').toLowerCase())) {
        partList.push(item)
      }
      if((exactList.length + partList.length) == 25) {
        return [exactList, partList]
      }
  }
  
  return [exactList, partList]
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  charted: false,
                    test: 'string',
                    eList: [],
                    pList: [],
                    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    var list = checkChart(event.target.value);
    var exactList = list[0];
    var partList = list[1];
    this.setState({eList: exactList});
    this.setState({pList: partList});

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var returnString = '';
    var listexact = this.state.eList.map(function(chart) {
      return <li key={chart.artist}>{chart.artist}  &emsp;   <i>{chart.title}</i>   &emsp;  Rank: {chart.rank}</li>
    })
    var listpartial = this.state.pList.map(function(chart) {
      return <li key={chart.artist}>{chart.artist}  &emsp;   <i>{chart.title}</i>  &emsp;   Rank: {chart.rank}</li>
    })

    return (
      <div>
        <form >
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <br />
        <ul>{listexact}</ul> 
        <br />
        <ul>{listpartial}</ul>
      </form>
      </div>
    );
  }
}

let domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<LikeButton />, domContainer);