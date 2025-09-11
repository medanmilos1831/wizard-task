import { FormWapper } from "../components";
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { type PropsWithChildren } from "react";
import styles from "./InformationStep.module.css";
import { useStepState, client } from "../createUserWizzard";

const { Title, Text, Paragraph } = Typography;

const InformationStep = ({ children }: PropsWithChildren) => {
  const { state, setState } = useStepState((state: any) => state);
  const { setStepComplete, onNextStep, getStateByStepName } = client;

  // Determine if description is required based on selected plan or addPlan step
  const planData = getStateByStepName("plan");
  const addPlanData = getStateByStepName("addPlan");

  // Check if description is required from either plan or addPlan step
  const isDescriptionRequired =
    planData?.isExtraInfoRequired || addPlanData?.isExtraInfoRequired || false;

  return (
    <Row justify="center">
      <Col span={20} lg={16} xl={20}>
        <Card className={styles.informationCard}>
          <div className={styles.headerSection}>
            <div className={styles.iconContainer}>👤</div>
            <Title level={2} className={styles.title}>
              Personal Information
            </Title>
            <Paragraph className={styles.subtitle}>
              Tell us about yourself to complete your profile
            </Paragraph>
          </div>

          <Divider className={styles.divider} />

          <FormWapper
            disabled={!!state}
            antFormProps={{
              onChange: (values: any) => {
                setStepComplete();
              },
              onFinish: (values: any) => {
                setState((prev: any) => {
                  return {
                    ...prev,
                    ...values,
                  };
                });
                onNextStep();
              },
              initialValues: state,
              layout: "vertical",
            }}
          >
            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  First Name
                </Text>
              }
              name="firstName"
              required
              rules={[
                { required: true, message: "Please enter first name!" },
                {
                  min: 2,
                  message: "First name must be at least 2 characters!",
                },
              ]}
            >
              <Input
                placeholder="Enter your first name..."
                size="large"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Last Name
                </Text>
              }
              name="lastName"
              required
              rules={[
                { required: true, message: "Please enter last name!" },
                {
                  min: 2,
                  message: "Last name must be at least 2 characters!",
                },
              ]}
            >
              <Input
                placeholder="Enter your last name..."
                size="large"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Age
                </Text>
              }
              name="age"
            >
              <Input
                placeholder="Enter your age..."
                size="large"
                type="number"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Email Address
                </Text>
              }
              name="email"
            >
              <Input
                placeholder="Enter your email address..."
                size="large"
                type="email"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Start Date
                </Text>
              }
              name="startDate"
            >
              <DatePicker
                placeholder="Select start date..."
                size="large"
                className={styles.datePicker}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Location
                </Text>
              }
              name="location"
            >
              <Input
                placeholder="Enter your location..."
                size="large"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Language
                </Text>
              }
              name="language"
            >
              <Input
                placeholder="Enter your preferred language..."
                size="large"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong className={styles.formLabel}>
                  Description
                  {isDescriptionRequired && (
                    <Text className={styles.requiredAsterisk}>*</Text>
                  )}
                </Text>
              }
              name="description"
              rules={[
                ...(isDescriptionRequired
                  ? [{ required: true, message: "Please enter description!" }]
                  : []),
                {
                  min: 3,
                  message: "Description must be at least 3 characters!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Tell us more about yourself..."
                size="large"
                rows={4}
                className={styles.textArea}
              />
            </Form.Item>

            {children}
          </FormWapper>
        </Card>
      </Col>
    </Row>
  );
};

export { InformationStep };
