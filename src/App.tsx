import { useState } from "react";

// React router imports
import { Outlet } from "react-router-dom";

// Context imports
import RealmContext from "./context/RealmContext";
import NavigationContext from "./context/NavigationContext";
import ActionMenuContext from "./context/ActionMenuContext";

// Theming imports
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./styles/GlobalStyle";
import useTheme from "./hooks/useTheme";

// helper functions imports
import connectToRealm from "./helpers/connectToRealm";

// type imports
import { Location, MarkerType } from "./components/map/mapTypes";
import MissionContext from "./context/MissionContext";
import { MissionSchema } from "./data/realm/schema/mission";
import CreateMarkerContext from "./context/CreateMarkerContext";

const App = () => {
  // get the current theme
  const { currentTheme } = useTheme();

  // initialize the MongoDB Realm connection
  const realm = connectToRealm();

  // state for the draw / navigation context
  const [isDrawOpen, setIsDrawOpen] = useState<boolean>(false);

  // state for the actionmenu context
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
  const [isCreateMarkerModeEnabled, setIsCreateMarkerModeEnabled] =
    useState<boolean>(false);
  const [isCreateMarkerDrawOpen, setIsCreateMarkerDrawOpen] =
    useState<boolean>(false);
  const [markerType, setMarkerType] = useState<MarkerType>(MarkerType.HAZARD);

  // state for the create marker context
  const [createMarkerLocation, setCreateMarkerLocation] = useState<Location>([
    0, 0,
  ]);

  // state for the mission context
  const [activeMission, setActiveMission] = useState<MissionSchema | null>(
    null
  );

  const [isPolygonDrawingActive, setIsPolygonDrawingActive] =
    useState<boolean>(false);

  const [polygonDrawingCoordinates, setPolygonDrawingCoordinates] = useState<
    number[][][]
  >([]);

  return (
    <>
      <RealmContext.Provider value={{ realm }}>
        {/* pass the appropriate global values for the current theme */}
        <ThemeProvider theme={currentTheme === "dark" ? darkTheme : lightTheme}>
          <NavigationContext.Provider value={{ isDrawOpen, setIsDrawOpen }}>
            <ActionMenuContext.Provider
              value={{
                isActionMenuOpen,
                setIsActionMenuOpen,
                isCreateMarkerModeEnabled,
                setIsCreateMarkerModeEnabled,
                isCreateMarkerDrawOpen,
                setIsCreateMarkerDrawOpen,
                markerType,
                setMarkerType,
              }}
            >
              <MissionContext.Provider
                value={{
                  activeMission,
                  setActiveMission,
                  isPolygonDrawingActive,
                  setIsPolygonDrawingActive,
                  polygonDrawingCoordinates,
                  setPolygonDrawingCoordinates,
                }}
              >
                <CreateMarkerContext.Provider
                  value={{ createMarkerLocation, setCreateMarkerLocation }}
                >
                  {/* React Router Outlet component always renders children  */}
                  <Outlet />
                </CreateMarkerContext.Provider>
              </MissionContext.Provider>
            </ActionMenuContext.Provider>
            <GlobalStyles />
          </NavigationContext.Provider>
        </ThemeProvider>
      </RealmContext.Provider>
    </>
  );
};

export default App;
