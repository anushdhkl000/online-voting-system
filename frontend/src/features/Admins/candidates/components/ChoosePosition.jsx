import React from "react";
import { Button, Grid, Modal, Text } from "@mantine/core";

const ChoosePosition = ({
  opened,
  close,
  triggerPosition,
  electionPosition,
}) => {
  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw="bold">Choose Position</Text>}
      >
        <Grid>
          {electionPosition?.map((position) => (
            <Grid.Col span={{ base: 12, md: 4 }} key={position._id}>
              <Button
                variant="outline"
                key={position._id}
                className="gap-2"
                onClick={() => triggerPosition(position)}
                disabled={position.isBlocked}
              >
                {position.position}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
      </Modal>
    </div>
  );
};

export default ChoosePosition;
