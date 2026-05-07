# Performance

bx-orm is designed to be as fast as possible, but there are some factors that can affect performance. Let's look at a few key areas where you can optimize performance in your application.

## ORM Startup

You want the short answer?

* Commit your XML mapping files to disk and set `this.ormSettings.generateMappings = false` to eliminate the XML mapping generation time on startup.
* Fine-tune `this.ormSettings.entityPaths` to minimize the number of candidate files that need to be parsed for entity discovery.

See also [Startup Metrics Logs](../intro/configuration/logging.md#startup-metrics-logs) for consolidated examples of the debug log output for ORM startup performance metrics.

### Entity Discovery

The initial step in ORM startup is to discover ORM entities and parse the entity metadata into internal structures. The time will be proportional to the number of entities found and the number of candidate files that need to be parsed to find those entities. By default, bx-orm will scan all CFC files in the specified entity paths, which can lead to a large number of candidate files and increased startup time.

This can be minimized by fine-tuning `this.ormSettings.entityPaths` [in your orm configuration](../intro/configuration).

Enable debug logging to see the time taken for entity discovery and metadata parsing in the logs:

```bash
ORM startup metric - entity file discovery: 42ms (187 candidate files found)
ORM startup metric - entity metadata parsing: 310ms (23 persistent entities found, sequential mode)
```

### XML Mapping Generation

Once persistent entities are located and metadata is collected, bx-orm generates XML mapping files for each entity. This process can be time-consuming, especially if you have a large number of entities. 

This startup penalty can be mostly eliminated by committing your hbm.xml mappings to disk and setting `this.ormSettings.generateMappings = false`.

Note that for any ORM entity changes, you will need to regenerate the XML mapping files by setting `this.ormSettings.generateMappings = true` and running `ormReload()` or restarting your application. This will regenerate the XML mappings to pick up any changes.

Enable debug mode to see the time taken for XML mapping generation in the logs:

```bash
ORM startup metric - XML mapping generation: 88ms (23 mapping files written)
```

### SessionFactory Build

The bulk of this time is spent in hibernate startup itself. You can minimize this by investigating and applying standard Hibernate performance optimizations.

Enable debug mode to see the time taken for SessionFactory building in the logs:

```bash
ORM startup metric - Hibernate SessionFactory build time [myDatasource]: 1243ms
```