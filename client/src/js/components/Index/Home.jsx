import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Home = ({ location }, { router }) => (
  <div className="simple-container home">
    Run <br />
    <button type="button" onClick={() => router.push('/test')}>TEST</button> <br />
    or learn more about <br />
    <Link to="/characters">Touhou characters</Link>
  </div>
);

Home.propTypes = {
  location: PropTypes.object,
};

Home.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Home;
