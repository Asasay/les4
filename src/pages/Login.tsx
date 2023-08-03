import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const onFinish = async (values: { username: string; password: string }) => {
    const res = await fetch("./login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.redirected) {
      window.location.href = res.url;
    } else if (res.status == 404) openNotification(await res.text());
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
      name="normal_login"
      className="login-form"
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
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="../register">register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
