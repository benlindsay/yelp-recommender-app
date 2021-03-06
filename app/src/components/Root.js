

import React from 'react';
import styles from './root.scss';
import 'babel-polyfill';
import axios from 'axios'
import loading from './loading.gif';

// Top layout component
export function Layout({children}) {
  return <div className="container">
    <div className={styles.container}>
      {children}
    </div>
  </div>
}


export function Checkbox({label, checked = false, onChange}) {
  return <div className="checkbox">
    <label>
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} /> {label}
    </label>
  </div>;
}


const CATEGORIES = {
  restaurants: 'Restaurants',
  shopping: 'Shopping',
  beauty: 'Beauty & Spas',
  nightlife: 'Nightlife',
  bars: 'Bars',
  active: 'Active Life',
  fashion: 'Fashion',
  coffee: 'Coffee & Tea',
  arts: 'Arts & Entertainment',
  hotels: 'Hotels & Travel',
};

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spec: {},
      users: [],
      selected: {}
    };
  }

  componentDidMount() {
    this.updateUsers(this.state.spec);
  }

  render () {
    return <Layout>
      <div>
        <h2 className={styles.title}>Find the hottest spots</h2>
        <form className="form-inline">
          <div className="form-group mb-10">
            <label>Select city</label>
            <select className="form-control" selected="0" onChange={(e) => this.updateUsers({...this.state.spec, city: e.target.value})}>
              {['Cleveland', 'Champaign', 'Charlotte', 'Pittsburgh', 'Las Vegas', 'Montreal', 'Toronto', 'Phoenix', 'Madison'].map((city)=>
                <option>{city}</option>
              )}
            </select>
          </div>

          <div className={styles.checkContainer}>
            {Object.keys(CATEGORIES).map((key)=>
              <Checkbox label={CATEGORIES[key]} checked={!!this.state.spec[key]} onChange={(x)=>this.updateUsers({...this.state.spec, [key]: x})} />
            )}
          </div>
        </form>

        <hr/>

        {!this.state.users.length && <Loading />}

        {this.state.users &&
          <div className="row">
            <div className="col-sm-6">
              {this._renderUserList()}
            </div>
            <div className="col-sm-6">

            </div>
          </div>
        }
      </div>
    </Layout>;
  }

  _renderUserList() {
    return this.state.users.map((user)=>
      <UserCard {...user} key={user.id} onClick={()=>this.toggleSelection(user.id)}
                          selected={this.state.selected[user.id]} />
    );
  }

  async updateUsers(spec) {
    this.setState({
      spec,
      users: [],
      selected: {}
    });
    let response = await axios.get('/users', {params: spec});
    this.setState({users: response.data});
  }

  toggleSelection(userId) {
    this.setState({selected: {
      ...this.state.selected,
      [userId]: !this.state.selected[userId]
    }});
  }
}


function UserCard({id, image, url, name, selected, onClick}) {
  return <div className={styles.profile + ' ' + (selected ? styles.profileSelected : '')} onClick={()=>onClick()}>
    <img src="http://www.clipartbest.com/cliparts/RiA/yB6/RiAyB6GMT.png" alt="" className="checkmark pull-right" />

    <img src={image} alt="" className="img-thumbnail pull-left" />
    <div className="content">
      <h3 className="title">{name}</h3>
      <a href={url} target="_blank">Check profile</a>
    </div>
    <div className="clearfix"></div>
  </div>;
}


function Loading() {
  return <div className={styles.loading}>
    <h4>Loading...</h4>
    <img src={'/static/' + loading}/>
  </div>;
}

