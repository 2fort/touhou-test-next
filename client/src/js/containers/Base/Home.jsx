import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const Home = ({ router }) => (
  <div className="simple-container home">
    Run <br />
    <button className="round" type="button" onClick={() => router.push('/test')}>TEST</button> <br />
    <button className="simple" type="button" onClick={() => router.push('/reverse-test')}>Reverse TEST</button> <br />
    or learn more about<br />
    <Link to="/browse">Touhou characters</Link>
  </div>
);

Home.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;
