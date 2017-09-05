import React from 'react';
import config from 'config';

const styles = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '50%',
  },
  logos: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 32,
    height: 'auto',
    paddingVertical: 'auto',
    paddingRight: 0
  }
}

class Map extends React.Component {
  constructor() {
    super();
    var companies = [];
    companies.push(1);
    companies.push(1);
    companies.push(1);
    companies.push(1);
    companies.push(1);
    this.state = {
      companies: companies
    }
  }

  render() {
    const { companies } = this.state;

    return (
      <div style={styles.content}> 
        <img style={styles.map} src={`${config.API_ROOT}/public/map_template.png`}/>
        <div style={styles.logos}> { 
          companies.map((company, index) =>
            <img key={index} style={styles.logo} src={`${config.API_ROOT}/public/company${index+1}.png`}/>
          )
        }
        </div>
      </div>
    );
  }
}

export default Map;