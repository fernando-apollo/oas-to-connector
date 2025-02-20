import fs from 'fs'
import Gen from "../parser/gen";
import Writer from "../parser/io/writer";
import * as path from "path";
import * as os from "os";
import {execSync, spawnSync} from 'child_process';
import * as assert from "node:assert";

const base = "/Users/fernando/Development/Apollo/connectors/projects/OasToConnector/apollo-connector-gen/src/test/resources/"

test('test minimal petstore', async () => {
  const paths = [
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name'
  ]

  await run(`petstore.yaml`, paths, 8, 2);
});

test('test minimal petstore 02', async () => {
  const paths = [
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#photoUrls>prop:scalar:PhotoUrlsItem',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:status'
  ]

  await run(`petstore.yaml`, paths, 8, 3);
});

test('test minimal petstore 03 array', async () => {
  const paths = [
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#photoUrls',
  ]

  await run(`petstore.yaml`, paths, 8, 1);
});

test('test full petstore', async () => {
  expect(fs.existsSync(`${base}/petstore.yaml`)).toBeTruthy();

  let file = fs.readFileSync(`${base}/petstore.yaml`);
  expect(file).toBeDefined();

  const paths = [
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#photoUrls',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:status',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:id',
    'get:/pet/{petId}>res:r>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:name',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:id',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#photoUrls',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:status',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:id',
    'get:/pet/findByStatus>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:name',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:id',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:ref:#category>obj:#/c/s/Category>prop:scalar:name',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:id',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:name',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#photoUrls',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:scalar:status',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:id',
    'get:/pet/findByTags>res:r>array:#/c/s/Pet>ref:#/c/s/Pet>obj:#/c/s/Pet>prop:array:#tags>prop:ref:#TagsItem>obj:#/c/s/Tag>prop:scalar:name',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:complete',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:id',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:petId',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:quantity',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:shipDate',
    'get:/store/order/{orderId}>res:r>ref:#/c/s/Order>obj:#/c/s/Order>prop:scalar:status',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:email',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:firstName',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:id',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:lastName',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:password',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:phone',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:username',
    'get:/user/{username}>res:r>ref:#/c/s/User>obj:#/c/s/User>prop:scalar:userStatus'
  ]

  await run(`petstore.yaml`, paths, 8, 5);
});

test('test_003_testConsumerJourney', async () => {
  const paths = [
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:firstName',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:lastName'
  ]

  await run("js-mva-consumer-info_v1.yaml", paths, 1, 2);
});

test('test_004_testConsumerJourneyScalarsOnly', async () => {
  const paths = [
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:birthDate',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:firstName',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:gender',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:lastName',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:me',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:taxIdentifier',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:title',
  ]

  await run("js-mva-consumer-info_v1.yaml", paths, 1, 2);
});

test('test_004_testAccountSegment', async () => {
  const paths = [
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:array:#accounts>prop:ref:#AccountsItem>obj:#/c/s/Account>prop:ref:#segment>obj:#/c/s/SegmentCharacteristic>prop:scalar:category',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:firstName',
    'get:/consumer/{id}>res:r>ref:#/c/s/Consumer>obj:#/c/s/Consumer>prop:scalar:gender'
  ]

  await run("js-mva-consumer-info_v1.yaml", paths, 1, 4);
});

test('test_005_testHomepageProductSelector', async () => {
  const paths = [
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:activationDate',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:contractEndDate',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:description',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:deviceCounter',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:hasUsage',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:id',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:isBundle',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:isBundled',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:isOneNumber',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:name',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:phoneNumber',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:price',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:renewalDate',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:serviceId',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:speed',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:status',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:scalar:type'
  ]

  await run("js-mva-homepage-product-selector_v3.yaml", paths, 3, 1);
});

test('test_006_testHomepageProductSelectorInlineArray', async () => {
  const paths = [
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:isUnlimited',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:remainingValue',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:totalValue',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:type',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:unit',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:usageType',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:usedValue',
    'get:/productSelectorItemDetails>res:r>ref:#/c/s/productSelectorItemDetails>obj:#/c/s/productSelectorItemDetails>prop:array:#usageConsumption>prop:obj:UsageConsumptionItem>obj:UsageConsumptionItem>prop:ref:#usageSummary>array:usageSummary>obj:usageSummary>prop:scalar:validFor'
  ]

  await run("js-mva-homepage-product-selector_v3.yaml", paths, 3, 3);
});

test('test_008_testHomepageProductSelectorAnonymousObject', async () => {
  const paths = [
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:array:#productRelationship>prop:ref:#ProductRelationshipItem>obj:#/c/s/productRelationship>prop:scalar:relationshipType'
  ]

  await run("js-mva-homepage-product-selector_v3.yaml", paths, 3, 2);
});

test('test_008_testHomepageProductSelectorAnonymousObject 02', async () => {
  const paths = [
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:array:#productRelationship>prop:ref:#ProductRelationshipItem>obj:#/c/s/productRelationship>prop:obj:product>obj:product>prop:scalar:id',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:array:#productRelationship>prop:ref:#ProductRelationshipItem>obj:#/c/s/productRelationship>prop:obj:product>obj:product>prop:scalar:name',
    'get:/productSelectorItems>res:r>ref:#/c/s/productSelectorItems>array:#/c/s/productSelectorItems>obj:#/c/s/productSelectorItems>prop:array:#productRelationship>prop:ref:#ProductRelationshipItem>obj:#/c/s/productRelationship>prop:obj:product>obj:product>prop:scalar:type'
  ]
  await run("js-mva-homepage-product-selector_v3.yaml", paths, 3, 3);
});

test('test_009_Customer360_ScalarsOnly', async () => {
  const paths = [
    'get:/customer360/{id}>res:r>ref:#/c/s/Customer360>comp:#/c/s/Customer360>ref:#/c/s/Entity>comp:#/c/s/Entity>ref:#/c/s/Addressable>obj:#/c/s/Addressable>prop:scalar:id'
  ]

  await run("TMF717_Customer360-v5.0.0.oas.yaml", paths, 3, 4);
});

test('test_010_TMF633_IntentOrValue_to_Union', async () => {
  const paths = [
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>ref:#/c/s/Entity>comp:#/c/s/Entity>ref:#/c/s/Addressable>obj:#/c/s/Addressable>prop:scalar:href',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:scalar:name',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#intent>comp:#/c/s/IntentRefOrValue>union:#/c/s/IntentRefOrValue>ref:#/c/s/IntentRef>comp:#/c/s/IntentRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:id',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#intent>comp:#/c/s/IntentRefOrValue>union:#/c/s/IntentRefOrValue>ref:#/c/s/IntentRef>comp:#/c/s/IntentRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:name'
  ]

  await run("TMF637-001-UnionTest.yaml", paths, 1, 8);
});

test('test_011_TMF637_001_ComposedTest', async () => {
  const paths = [
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:scalar:name',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>ref:#/c/s/Entity>comp:#/c/s/Entity>ref:#/c/s/Addressable>obj:#/c/s/Addressable>prop:scalar:id',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@baseType',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@schemaLocation',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@type',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:@referredType',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:href',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:id',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>obj:#/c/s/EntityRef>prop:scalar:name',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>obj:#/c/s/BillingAccountRef>prop:scalar:ratingType',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>ref:#/c/s/Addressable>obj:#/c/s/Addressable>prop:scalar:href',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>ref:#/c/s/Addressable>obj:#/c/s/Addressable>prop:scalar:id',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@baseType',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@schemaLocation',
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#billingAccount>comp:#/c/s/BillingAccountRef>ref:#/c/s/EntityRef>comp:#/c/s/EntityRef>ref:#/c/s/Extensible>obj:#/c/s/Extensible>prop:scalar:@type'
  ]

  await run("TMF637-ProductInventory-v5.0.0.oas.yaml", paths, 2, 6);
});

/** checks that because we have a circular reference we can't find a type. this would never happen if the paths
 * were generated using the command line. */
test('test_013_testTMF637_TestSimpleRecursion no type found', async () => {
  const paths = [
    'get:/productById>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:scalar:sku',
    'get:/productById>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#relatedProduct>comp:#/c/s/Product>obj:#/c/s/Product>prop:scalar:sku'
  ]

  // two checks in the run function + 1 here
  expect.assertions(4);
  try {
    await run("TMF637-002-SimpleRecursionTest.yaml", paths, 1, 2, true);
  } catch (error) {
    expect(error).toBeDefined()
    expect((error as any).message).toContain("Could not find type")
  }
});

test('test_014_testTMF637_TestRecursion', async () => {
  const paths = [
    'get:/productById>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:array:#relatedParty>prop:ref:#RelatedPartyItem>comp:#/c/s/RelatedPartyOrPartyRole>obj:#/c/s/RelatedPartyOrPartyRole>prop:scalar:role',
    'get:/productById>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:array:#relatedParty>prop:ref:#RelatedPartyItem>comp:#/c/s/RelatedPartyOrPartyRole>obj:#/c/s/RelatedPartyOrPartyRole>prop:ref:#partyOrPartyRole>comp:#/c/s/PartyOrPartyRole>union:#/c/s/PartyOrPartyRole>ref:#/c/s/Producer>comp:#/c/s/Producer>ref:#/c/s/PartyRole>comp:#/c/s/PartyRole>obj:#/c/s/PartyRole>prop:scalar:name'
  ]

  expect.assertions(6)
  await run("TMF637-002-RecursionTest.yaml", paths, 1, 7);
});

test('test_014_testTMF637_TestRecursion 02', async () => {
  /* An interesting test: the cli won't produce an invalid schema if the CircularRef node is added. The
  * selection process stops there, and won't let the user choose any descendants, thus avoiding the recursion
  * altogether. */
  const paths = [
    'get:/productById>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:array:#relatedParty>prop:ref:#RelatedPartyItem>comp:#/c/s/RelatedPartyOrPartyRole>obj:#/c/s/RelatedPartyOrPartyRole>prop:ref:#partyOrPartyRole>comp:#/c/s/PartyOrPartyRole>union:#/c/s/PartyOrPartyRole>ref:#/c/s/Producer>comp:#/c/s/Producer>ref:#/c/s/PartyRole>comp:#/c/s/PartyRole>obj:#/c/s/PartyRole>prop:scalar:name'
  ]
  const output = await run("TMF637-002-RecursionTest.yaml", paths, 1, 7);
});

test('test_015_testTMF637_ProductStatusEnum', async () => {
  const paths = [
    'get:/product/{id}>res:r>ref:#/c/s/Product>comp:#/c/s/Product>obj:#/c/s/Product>prop:ref:#status>enum:#/c/s/ProductStatusType'
  ]
  const output = await run("TMF637-ProductInventory-v5.0.0.oas.yaml", paths, 2, 5);
});

// run test
async function run(file: string, paths: string[], pathsSize: number, typesSize: number, shouldFail: boolean = false): Promise<string | undefined> {
  const gen = await Gen.fromFile(`${base}/${file}`);
  await gen.visit();

  expect(gen.paths).toBeDefined();
  expect(gen.paths.size).toBe(pathsSize);

  const writer: Writer = new Writer(gen);

  try {
    writer.generate(paths);
  } catch (err) {
    throw err;
  }

  expect(gen.context?.types.size).toBe(typesSize);

  const schema = writer.flush();
  expect(schema).toBeDefined();

  const schemaFile = path.join(os.tmpdir(), file.replace(/yaml|json|yml/, "graphql"));
  fs.writeFileSync(schemaFile, schema, {encoding: 'utf-8', flag: 'w'});

  const [result, output] = compose(schemaFile);
  if (!shouldFail) {
    expect(result).toBeTruthy();
    expect(output).toBeUndefined();
  } else {
    expect(result).toBeFalsy();
    expect(output).toBeDefined();
    return output;
  }
}

/// rover checks
function isRoverAvailable(command: string): [boolean, string?] {
  const cmd = os.platform() === 'win32' ? 'where' : 'which';
  const result = spawnSync(cmd, [command], {encoding: 'utf8'});

  return [result.status === 0, result.stdout.toString().trim()];
}

function compose(schemaPath: string) {
  let rover: [boolean, (string | undefined)?] = isRoverAvailable('rover');
  if (!rover[0]) {
    throw new Error("Rover is not available");
  }

  const supergraphFile = path.join(os.tmpdir(), 'supergraph.yaml');
  const content: string = `
federation_version: =2.10.0-preview.3
subgraphs:
  test_spec:
    routing_url: http://localhost # this value is ignored
    schema:
      file: ${schemaPath} # path to the schema file`;

  fs.writeFileSync(supergraphFile, content, {encoding: 'utf-8', flag: 'w'});

  const cmd = `${rover[1]} supergraph compose --config ${supergraphFile} --elv2-license accept`

  let output;
  try {
    output = execSync(cmd, {stdio: 'pipe'});
    return [true, undefined];
  } catch (error: any) {
    return [false, error?.message];
  }
}