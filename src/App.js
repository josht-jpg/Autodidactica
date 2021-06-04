import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import WelcomeScreen from "./components/screens/welcomeScreen/WelcomeScreen";
import AddSubjectScreen from "./components/screens/addScreens/addSubjectScreen/AddSubjectScreen";
import ResourceScreen from "./components/screens/RescourceScreen";
import ProjectScreen from "./components/screens/ProjectScreen";
import NotesScreen from "./components/screens/notesScreen/NotesScreen";
import GoalsScreen from "./components/screens/goalsScreen/GoalsScreen";
import ExerciseScreen from "./components/screens/ExerciseScreen";
import Transcript from "./components/transcript/Transcript";
import PublicTranscript from "./components/transcript/public/PublicTranscript";
import Dashboard from "./components/dashboard/Dashboard";

import "react-quill/dist/quill.snow.css";

function App() {
  return (
    <Router>
      <main className="py-3">
        <>
          <Route path="/" component={WelcomeScreen} exact />
          <Route path="/subject" component={AddSubjectScreen} />
          <Route path="/transcript" component={Transcript} />
          <Route
            path="/dashboard/quarters"
            render={() => <Dashboard timelineType="quarters" />}
          />
          <Route
            path="/dashboard/months"
            render={() => <Dashboard timelineType="months" />}
          />
          <Route
            path="/dashboard/weeks"
            render={() => <Dashboard timelineType="weeks" />}
          />
          <Route
            path="/dashboard/days"
            render={() => <Dashboard timelineType="days" />}
          />
          <Route path="/resources" component={ResourceScreen} />
          <Route path="/projects" component={ProjectScreen} />
          <Route path="/exercises" component={ExerciseScreen} />
          <Route path="/goals" component={GoalsScreen} />
          <Route path="/notes" component={NotesScreen} />
          <Route path="/public/:id" component={PublicTranscript} exact />
        </>
      </main>
    </Router>
  );
}

export default App;
