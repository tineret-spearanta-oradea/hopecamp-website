import React from "react";
import NavigationBar from "../navigationBar";

const Home = () => {
  return (
    <>
      <NavigationBar />
      <div className="pt-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="pt-20">
          <div>
            <div className="text-4xl font-bold flex justify-center">
              Hope Camp
            </div>
            <div className="text-base flex justify-center text-center p-4">
              Work in progress... Please, come back later!
              <br />
              Will be back sooon.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
