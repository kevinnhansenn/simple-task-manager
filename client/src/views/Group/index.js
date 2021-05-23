import { useState, useRef } from "react";
import QueueAnim from "rc-queue-anim";
import styles from "./index.module.css";
import { Input, message } from "antd";
import { DeleteOutlined, GroupOutlined } from "@ant-design/icons";
import { __addGroup, __deleteGroup } from "../../api/group";

const Group = ({ items, selectedItem, setSelectedItem, setGroup, setTask }) => {
  const [hoverItem, setHoverItem] = useState(null);

  const deleteItem = (e, id) => {
    e.stopPropagation();
    __deleteGroup(id).then((res) => {
      setGroup(res.data.updatedGroup);
      setTask(res.data.updatedTask);
      message.success("Group has been deleted");
    });
  };

  const input = useRef(null);

  const onAdd = () => {
    const groupName = input.current.state.value.trim();
    if (!groupName) return;

    __addGroup(groupName).then((res) => {
      setGroup(res.data);
      message.success("Group has been added");
    });

    input.current.state.value = "";
  };

  return (
    <div className="demo-content">
      <h1 className={styles.title}>Task Group</h1>
      <div className={styles.input}>
        <Input.Search
          ref={input}
          placeholder="Enter group name"
          allowClear
          enterButton="Add Group"
          size="medium"
          prefix={<GroupOutlined />}
          onSearch={onAdd}
        />
      </div>
      <div className="demo-tbody" key="b">
        <QueueAnim component="ul" type={["right", "left"]} leaveReverse>
          {items.map((item) => (
            <li
              key={item._id}
              className={selectedItem === item._id ? styles.selected : ""}
              onMouseEnter={() => setHoverItem(item._id)}
              onMouseLeave={() => setHoverItem(null)}
              onClick={() =>
                selectedItem === item._id
                  ? setSelectedItem(null)
                  : setSelectedItem(item._id)
              }
            >
              {item.name}
              {selectedItem !== item._id && (
                <DeleteOutlined
                  onClick={(e) => deleteItem(e, item._id)}
                  className={[
                    styles.delete,
                    hoverItem === item._id
                      ? styles.deleteShow
                      : styles.deletePartialHide,
                  ]}
                />
              )}
            </li>
          ))}
        </QueueAnim>
      </div>
    </div>
  );
};

export default Group;
