/*

We only need this test to debug the module if the docker test fails. Otherwise its functionally identical to the docker test and robs us of ports.
import { OpenAPIClientAxios } from "openapi-client-axios";

import { builderFactory } from "@gridql/payload-generator";

import assert from "assert";

import { DockerComposeEnvironment } from "testcontainers";

import { Kafka } from "kafkajs";

import fs from "fs";

import { TestConsumer } from "@gridql/kafka-consumer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { before, describe, it } from "mocha";

let schema;
let kafka;
let swagger_clients = {};

import Log4js from "log4js";
import { init } from "@gridql/mongo-event-builder/lib/config.js";
import { start } from "@gridql/mongo-event-builder";

Log4js.configure({
  appenders: {
    out: {
      type: "stdout",
    },
  },
  categories: {
    default: { appenders: ["out"], level: "trace" },
  },
});

before(async function () {
  this.timeout(200000);

  await new DockerComposeEnvironment(
    __dirname,
    __dirname + "/integration.yml",
  ).up();

  for (let restlette of ["test"]) {
    let rest = await fetch(
      `http://localhost:3033/${restlette}/api/api-docs/swagger.json`,
    );
    let swaggerdoc = await rest.json();
    let api = new OpenAPIClientAxios({ definition: swaggerdoc });
    swagger_clients[`/${restlette}/api`] = await api.init();
  }

  schema = JSON.parse(
    fs.readFileSync(__dirname + "/service/json/test.schema.json").toString(),
  );

  kafka = new Kafka({
    //logLevel: logLevel.INFO,
    brokers: ["localhost:29093"],
    clientId: "db-events-test",
  });

  process.env.MONGO_URI = "mongodb://localhost:37017";
  process.env.KAFKA_URI = "localhost:29093";
  process.env.KAFKA_HOST = "localhost";

  const builders = await init(__dirname + "/config/config.conf");
  await start(builders);
});


describe("Should give us an opportunity to debug the listener", function () {
  this.timeout(50000);
  it("should create a test", async () => {
    //Given I have a consumer
    let tc = new TestConsumer(kafka, { groupId: "docker-test" });
    await tc.init("test");
    await tc.run();

    //When an event is sent to a context

    let test_factory = builderFactory(schema);
    let test = test_factory();

    const result = await swagger_clients["/test/api"].create(null, test);

    let actual_id = result.headers["x-canonical-id"];

    const actual = await tc.current(500);

    assert.notEqual(actual, undefined);

    //Then we should get a record that the event has been saved
    assert.equal(actual.id, actual_id);
    assert.equal(actual.operation, "CREATE");

    assert.equal(result.status, 200);
    assert.equal(result.data.name, test.name);
  });
});
*/