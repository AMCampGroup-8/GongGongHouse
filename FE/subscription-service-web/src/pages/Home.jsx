import React from 'react';
import InterestList from '../components/InterestList';
import InterestForm from '../components/InterestForm';

const Home = () => {
  return (
    <div>
      <h1>관심 청약 서비스</h1>
      <InterestForm />
      <hr />
      <InterestList />
    </div>
  );
};

export default Home;
