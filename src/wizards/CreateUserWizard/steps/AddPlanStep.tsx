import { FormWapper } from "../components";
import {
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { type PropsWithChildren } from "react";
import styles from "./AddPlanStep.module.css";
import { useWizzard } from "../../../Wizard/Provider";

const { Title, Text, Paragraph } = Typography;

const AddPlanStep = ({ children }: PropsWithChildren) => {
  const client = useWizzard();
  const {
    setStepComplete,
    nextStep,
    setState: setStateClient,
    getStepState,
  } = client;
  return (
    <>
      <Row justify="center">
        <Col span={20} lg={16} xl={20}>
          <Card className={styles.addPlanCard}>
            <div className={styles.headerSection}>
              <div className={styles.iconContainer}>📋</div>
              <Title level={2} className={styles.title}>
                Create Your Plan
              </Title>
              <Paragraph className={styles.subtitle}>
                Add a custom plan to your account with personalized settings
              </Paragraph>
            </div>

            <Divider className={styles.divider} />

            <FormWapper
              disabled={!!getStepState()}
              antFormProps={{
                onFinish: (values: any) => {
                  setStateClient(values);
                  nextStep();
                },
                initialValues: getStepState(),
                layout: "vertical",
              }}
            >
              <Form.Item
                label={
                  <Text strong className={styles.formLabel}>
                    Plan Name
                  </Text>
                }
                name="name"
                rules={[
                  { required: true, message: "Please enter plan name!" },
                  {
                    min: 2,
                    message: "Plan name must be at least 2 characters!",
                  },
                ]}
              >
                <Input
                  onChange={(e: any) => {
                    setStepComplete();
                  }}
                  placeholder="Enter your plan name..."
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>

              <Form.Item name="isExtraInfoRequired" valuePropName="checked">
                <Checkbox className={styles.checkboxContainer}>
                  <Text className={styles.checkboxText}>
                    Description is required for this plan
                  </Text>
                </Checkbox>
              </Form.Item>

              {children}
            </FormWapper>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { AddPlanStep };
