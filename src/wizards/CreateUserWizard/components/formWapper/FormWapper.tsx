import { Form as AntdForm, type FormProps } from "antd";
import { type PropsWithChildren } from "react";

export const FormWapper = ({
  children,
  antFormProps,
  disabled = false,
}: PropsWithChildren<{ antFormProps: FormProps; disabled?: boolean }>) => {
  const [antdForm] = AntdForm.useForm();
  return (
    <AntdForm
      form={antdForm}
      layout="vertical"
      disabled={disabled}
      {...antFormProps}
    >
      {children}
    </AntdForm>
  );
};
