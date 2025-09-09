import { Layout, Typography, Button, Space } from "antd";
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { increment, decrement } from "./store/slices/counterSlice";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <Layout className="min-h-screen">
      <Header className="bg-blue-600 flex items-center">
        <Title level={3} className="text-white mb-0">
          NFinnova
        </Title>
      </Header>

      <Content className="p-8">
        <div className="max-w-4xl mx-auto">
          <Title level={1} className="text-center mb-8">
            Welcome to NFinnova
          </Title>

          <div className="text-center mb-8">
            <Title level={2}>Counter Example</Title>
            <Paragraph className="text-lg mb-4">
              Current count:{" "}
              <span className="font-bold text-blue-600">{count}</span>
            </Paragraph>

            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={() => dispatch(increment())}
              >
                Increment
              </Button>
              <Button size="large" onClick={() => dispatch(decrement())}>
                Decrement
              </Button>
            </Space>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <Title level={3}>Tech Stack</Title>
            <ul className="list-disc list-inside space-y-2">
              <li>React 18 with TypeScript</li>
              <li>Vite for fast development</li>
              <li>Redux Toolkit for state management</li>
              <li>React Query for server state</li>
              <li>Ant Design for UI components</li>
              <li>Tailwind CSS for styling</li>
              <li>ESLint for code quality</li>
            </ul>
          </div>
        </div>
      </Content>

      <Footer className="text-center bg-gray-100">
        <Paragraph className="mb-0">
          NFinnova ©2024 - Built with modern React stack
        </Paragraph>
      </Footer>
    </Layout>
  );
}

export default App;
