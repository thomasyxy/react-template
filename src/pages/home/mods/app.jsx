
import React, { PropTypes } from 'react';
import assign from 'object-assign';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = assign({}, props, {
			curKey: null
    });
		this.handleChangeColor = this.handleChangeColor.bind(this);
  }

  componentWillMount() {
  }

	handleChangeColor(key) {
		this.setState({
			curKey: key
		})
	}

  render() {
		const {
			curKey
		} = this.state;
		const list = [
			"item1",
			"item2",
			"item3",
			"item4",
			"item5",
		];
    return <div className="app-page">
			<ul>
				{
					list.map((item, key) =>
						<li
							onClick={() => {this.handleChangeColor(key)}}
							style={{backgroundColor: key === curKey ? 'red' : ''}}
							key={key}
						>
							{item}
						</li>
					)
				}
			</ul>
    </div>
  }
}

export default App;
