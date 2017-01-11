import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Home = ({ router }) => (
  <div className="simple-container home">
    Run <br />
    <button type="button" onClick={() => router.push('/test')}>TEST</button> <br />
    or learn more about <br />
    <Link to="/characters">Touhou characters</Link>
  </div>
);

Home.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;
