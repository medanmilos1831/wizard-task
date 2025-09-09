import { Col } from "antd";
import { AnswerButton } from "./buttons";

interface AnswerListProps<T> {
  items: T[];
  id: number;
  onAnswerClick: (item: T) => void;
  isLocked: boolean;
}

export const AnswerList = <T extends { id: number | string; name: string }>({
  items,
  id,
  onAnswerClick,
  isLocked,
}: AnswerListProps<T>) => {
  return (
    <>
      {items.map((item) => {
        const isActive = id === item.id;
        return (
          <Col span={24 / items.length} key={item.id}>
            <AnswerButton
              isActive={isActive}
              label={item.name}
              onClick={() => {
                if (isLocked) return;
                onAnswerClick(item);
              }}
              disabled={isLocked}
            />
          </Col>
        );
      })}
    </>
  );
};
