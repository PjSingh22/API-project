import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import { loadSpotsThunk } from "./store/spots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchedSpots = useSelector(state => state.spots.allSpots);
  const spots = Object.values(fetchedSpots);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <div className="app-body">
        <Switch>
          <Route exact path="/">
            <AllSpots spots={spots} />
          </Route>
        </Switch>
      </div>
      }
    </>
  );
}

export default App;
