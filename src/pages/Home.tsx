import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { CheckCircleFilled, DeleteFilled, StopFilled } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  id: number;
  User: string;
  createdAt: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Username",
    dataIndex: "User",
  },
  {
    title: "Registration Date",
    dataIndex: "createdAt",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
];

/* const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    User: `Edward King ${i}`,
    id: 32,
    status: `London, Park Lane no. ${i}`,
    createdAt: new Date(1691048513 * 1000).toDateString(),
  });
} */

const Home: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    fetch("/users")
      .then((response) => {
        if (response.status != 200) return Promise.reject(response.status);
        console.log(response.redirected);
        if (response.redirected) {
          window.location.href = response.url;
        } else return response.json();
      })
      .then((users) => {
        for (let i = 0; i < users.length; i++) {
          users[i].key = i;
        }
        setData(users);
        setSelectedRowKeys([]);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setSelectedRowKeys([]);
        setLoading(false);
      });
  };

  const setStatus = (action: string) =>
    fetch("/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: action,
        id: data
          .filter((user) => selectedRowKeys.includes(user.key))
          .map((user) => user.id),
      }),
    }).then(getUsers);

  const deleteUsers = () =>
    fetch("/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        data
          .filter((user) => selectedRowKeys.includes(user.key))
          .map((user) => user.id)
      ),
    }).then(getUsers);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={() => setStatus("block")}
          disabled={!hasSelected}
          loading={loading}
          icon={<StopFilled />}
        >
          Block
        </Button>
        <Button
          onClick={() => setStatus("unblock")}
          disabled={!hasSelected}
          loading={loading}
          icon={<CheckCircleFilled />}
        >
          Unblock
        </Button>
        <Button
          onClick={deleteUsers}
          disabled={!hasSelected}
          loading={loading}
          icon={<DeleteFilled />}
        >
          Delete
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </Space>
      <div style={{ marginLeft: 16, float: "right" }}>
        <Button type="primary">SignOut</Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default Home;
