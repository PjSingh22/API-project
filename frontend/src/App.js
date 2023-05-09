import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import ViewSpot from "./components/ViewSpot";
import { loadSpotsThunk } from "./store/spots";
import ManageSpots from "./components/ManageSpots";
import CreateSpot from "./components/SpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const fetchedSpots = useSelector(state => state.spots.allSpots);
  // const spots = Object.values(fetchedSpots);
  const defaultImg = "https://www.gannett-cdn.com/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?crop=5619,3161,x0,y104&width=660&height=372&format=pjpg&auto=webp"

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(loadSpotsThunk());
  // }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <div className="app-body">
        <Switch>
          <Route path="/user/spots/create">
            <CreateSpot />
          </Route>
          <Route path="/user/spots">
            <ManageSpots />
          </Route>
          <Route path="/spots/:spotId">
            <ViewSpot defaultImg={defaultImg} />
          </Route>
          <Route exact path="/">
            <AllSpots defaultImg={defaultImg} />
          </Route>
        </Switch>
      </div>
      }
    </>
  );
}

export default App;
