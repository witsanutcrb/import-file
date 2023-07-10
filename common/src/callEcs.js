const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');

const client = new ECSClient();

process.env.SUBNET01 = 'subnet-06a960b954cdaba4e';
process.env.SUBNET02 = 'subnet-06f7087f57b8a59bb';
process.env.SECURITY_GROUP_IDS = 'sg-0b869365e6a050441';
process.env.TASK_DEFINITION_REACH90_RESULT_INPUT =
  'tcrb-debtacq-reach-DebtReach';
process.env.CLUSTER_REACH90_RESULT_INPUT =
  'tcrb-debtacq-reach-DebtReach-cluster';
const runEcsTask = async (env) => {
  const params = {
    taskDefinition: `${process.env.TASK_DEFINITION_REACH90_RESULT_INPUT}`,
    cluster: process.env.CLUSTER_REACH90_RESULT_INPUT,
    launchType: 'FARGATE',
    count: 1,
    platformVersion: 'LATEST',
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [process.env.SUBNET01, process.env.SUBNET02],
        securityGroups: [process.env.SECURITY_GROUP_IDS],
        assignPublicIp: 'DISABLED',
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.TASK_DEFINITION_REACH90_RESULT_INPUT,
          environment: env,
        },
      ],
    },
  };

  const command = new RunTaskCommand(params);
  try {
    const data = await client.send(command);
    console.log('[Call Ecs]', data);
    return true;
    // process data.
  } catch (error) {
    console.log('[ERROR] Call ECS ', error);
    return false;
    // error handling.
  }
};

module.exports = { runEcsTask };
