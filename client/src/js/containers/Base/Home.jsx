import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import Container from './components/Container';
import * as style from './Home.style';

const Home = ({ router }) => (
  <Container>
    <div className={style.home}>
      Try <br />
      <button className={style.btnSimple} type="button" onClick={() => router.push('/test')}>
        TEST
      </button>
      <button className={style.btnSimple} type="button" onClick={() => router.push('/reverse-test')}>
        Reverse TEST
      </button>
      <br />
      or learn more about<br />
      <Link to="/browse">Touhou characters</Link>
    </div>
  </Container>
);

Home.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;
