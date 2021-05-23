import "./App.css";
import { useState, useEffect } from "react";
import { Card, message, Spin } from "antd";
import Group from "./views/Group";
import Task from "./views/Task";
import { __fetchGroups } from "./api/group";
import { __fetchTasks } from "./api/task";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([]);
  const [task, setTask] = useState([]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const groups = await __fetchGroups();
      setGroup(groups.data);
    } catch {
      message.error("Fetch Group Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasks = await __fetchTasks();
      setTask(tasks.data);
    } catch {
      message.error("Fetch Task Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <Spin spinning={loading}>
          <Card style={{ width: "900px", minHeight: "400px" }}>
            <div className="section">
              <Group
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                items={group}
                setGroup={setGroup}
                setTask={setTask}
              />
              <Task
                selectedGroup={selectedItem}
                items={task}
                setItems={setTask}
                group={group}
                setTask={setTask}
              />
            </div>
          </Card>
        </Spin>
        <div className={"footer"}>
          &copy; Simple Task Manager - May 23, 2021
        </div>
      </div>
    </div>
  );
}

export default App;
