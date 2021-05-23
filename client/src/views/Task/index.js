import { useState, useRef, useEffect } from "react";
import QueueAnim from "rc-queue-anim";
import styles from "./index.module.css";
import { Button, DatePicker, Input, Modal, Popover, message } from "antd";
import moment from "moment";
import {
  CheckCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  __addTask,
  __completeTask,
  __deleteTasks,
  __editTask,
  __moveTasks,
} from "../../api/task";

const Task = ({ items, group, selectedGroup, setTask }) => {
  const inputName = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [inputDeadline, setInputDeadline] = useState(false);
  const [inputDescription, setInputDescription] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    setSelectedItem([]);
  }, [selectedGroup]);

  const title = group.find((g) => g._id === selectedGroup);

  let _items = items;
  if (selectedGroup) {
    _items = _items.filter((item) => item.group === selectedGroup);
  }

  const popOverContent = (
    <div className={styles.popover}>
      {group.map((g) => (
        <div
          key={g._id}
          className={g._id === selectedGroup ? styles.popoverSelected : ""}
          onClick={() => g._id !== selectedGroup && moveButtonClicked(g._id)}
        >
          {g.name}{" "}
        </div>
      ))}
    </div>
  );

  const changeTaskStatus = (e, id) => {
    e.stopPropagation();
    __completeTask(id).then((res) => {
      setTask(res.data);
      message.success("Task marked as completed");
    });
  };

  const onAdd = (e) => {
    e.stopPropagation();
    setDialog("add");
    setTimeout(() => {
      inputName.current.state.value = "";
      setInputDeadline(null);
      setInputDescription(null);
    }, 10);
  };

  const onEdit = (e, id) => {
    e.stopPropagation();
    setIsEditing(id);
    setDialog("edit");

    setTimeout(() => {
      const _task = [...items].find((item) => item._id === id);
      inputName.current.state.value = _task.name;
      setInputDeadline(moment(_task.deadline, "YYYY-MM-DD"));
      setInputDescription(_task.description);
    }, 10);
  };

  const confirmButtonClicked = () => {
    const _inputName = inputName.current.state.value;
    const _inputDeadline = inputDeadline
      ? inputDeadline.format("YYYY-MM-DD")
      : "";
    const _inputDescription = inputDescription ? inputDescription.trim() : "";
    if (!_inputName || !_inputDeadline) return;

    setDialog(null);
    setTimeout(() => {
      if (isEditing) {
        __editTask({
          id: isEditing,
          name: _inputName,
          deadline: _inputDeadline,
          description: _inputDescription,
        }).then((res) => {
          setTask(res.data);
          message.success("Task has been edited");
        });
      } else {
        __addTask({
          name: _inputName,
          deadline: _inputDeadline,
          description: _inputDescription,
          group: selectedGroup,
        }).then((res) => {
          setTask(res.data);
          message.success("Task has been added");
        });
      }
    }, 250);
  };

  const deleteSelected = () => {
    __deleteTasks(selectedItem).then((res) => {
      setTask(res.data);
      setSelectedItem([]);
      message.success("Tasks have been deleted");
    });
  };

  const moveButtonClicked = (id) => {
    __moveTasks(selectedItem, id).then((res) => {
      setTask(res.data);
      setSelectedItem([]);
      setPopoverVisible(false);
      message.success("Tasks moved successfully");
    });
  };

  return (
    <div className="demo-content">
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          {title ? `${title.name}` : "All Tasks"}
        </h1>
        {selectedGroup && !selectedItem.length && (
          <div className={styles.actionButton}>
            <Button onClick={onAdd} type={"primary"} icon={<PlusOutlined />}>
              Add Task
            </Button>
          </div>
        )}
        {selectedItem.length > 0 && (
          <div className={[styles.actionButton]}>
            <Popover
              onVisibleChange={(v) => setPopoverVisible(v)}
              visible={popoverVisible}
              content={popOverContent}
              title="Move to:"
              trigger="click"
            >
              <Button type="primary" ghost>
                Move ({selectedItem.length})
              </Button>
            </Popover>
            <Button danger onClick={deleteSelected}>
              Delete ({selectedItem.length})
            </Button>
          </div>
        )}
      </div>

      <div className="demo-tbody" key="b">
        <QueueAnim component="ul" type={["right", "left"]} leaveReverse>
          {_items.map((item) => {
            const addItem = (id) => {
              setSelectedItem([...selectedItem, id]);
            };

            const removeItem = (id) => {
              const _item = selectedItem.filter((item) => item !== id);
              setSelectedItem(_item);
            };

            return (
              <li
                key={item._id}
                style={
                  selectedItem.includes(item._id)
                    ? { background: "#E6F7FF" }
                    : item.completed
                    ? { background: "#F6FFED" }
                    : item.expired
                    ? { background: "#FFF2F0" }
                    : {}
                }
                className={
                  selectedItem.includes(item._id) ? styles.selected : ""
                }
                onMouseEnter={() => setHoverItem(item._id)}
                onMouseLeave={() => setHoverItem(null)}
                onClick={() =>
                  selectedItem.includes(item._id)
                    ? removeItem(item._id)
                    : addItem(item._id)
                }
              >
                <div
                  className={
                    hoverItem === item._id ? styles.hovered : styles.notHovered
                  }
                >
                  <div>
                    <div className={styles.listTitle}>{`${item.name}`}</div>
                    <div className={styles.description}>{item.description}</div>
                  </div>
                  <div className={styles.actionSection}>
                    <div className={styles.deadline}>
                      <div>{item.deadline}</div>
                      {item.expired ? (
                        <div className={styles.expired}>EXPIRED</div>
                      ) : (
                        item.completed && (
                          <div className={styles.completed}>COMPLETED</div>
                        )
                      )}
                    </div>
                    {!item.completed && !selectedItem.includes(item._id) && (
                      <div style={{ paddingTop: 3 }}>
                        <SettingOutlined
                          onClick={(e) => onEdit(e, item._id)}
                          className={styles.editIcon}
                        />
                        {!item.expired && (
                          <CheckCircleOutlined
                            onClick={(e) => changeTaskStatus(e, item._id)}
                            className={styles.checkIcon}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </QueueAnim>
      </div>

      <Modal
        title={dialog === "edit" ? "Edit Task" : `Add New Task`}
        visible={dialog}
        afterClose={() => setIsEditing(null)}
        onOk={confirmButtonClicked}
        okText={dialog === "edit" ? "Edit Task" : "Add Task"}
        onCancel={() => setDialog(false)}
      >
        <div className={styles.inputSection}>
          <div>
            Title <span style={{ color: "#ff4d4f" }}>*</span>
          </div>
          <Input
            ref={inputName}
            placeholder="Enter task name"
            allowClear
            style={{ width: 320 }}
          />
        </div>
        <div className={styles.inputSection}>
          <div>
            Deadline <span style={{ color: "#ff4d4f" }}>*</span>
          </div>
          <DatePicker
            value={inputDeadline}
            onChange={(e) => setInputDeadline(e)}
            size="middle"
            placeholder="Select deadline"
          />
        </div>
        <div className={styles.inputSection}>
          <div>Description</div>
          <Input.TextArea
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
            placeholder="Optional"
            showCount
            style={{ width: 320 }}
            maxLength={100}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Task;
