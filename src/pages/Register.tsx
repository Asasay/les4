import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, notification } from "antd";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const onFinish = async (values: { username: string; password: string }) => {
    const res = await fetch("./register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.redirected) {
      window.location.href = res.url;
    } else if (res.status == 409) openNotification(await res.text());
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (description: string) => {
    api.error({
      message: `Error`,
      description,
      placement: "bottom",
    });
  };

  return (
    <Form
      name="register"
      className="register-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      {contextHolder}
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            Register
          </Button>
          Or <Link to="../login">login now!</Link>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Register;
