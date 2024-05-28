const { readFileSync, writeFileSync } = require('fs');
const bundle = require('@asyncapi/bundler');
const { DiagnosticSeverity, Parser } = require('@asyncapi/parser');


async function main() {
  // bundle
  const bundledDocument = await bundle('main.yml')
  writeFileSync('bundled.yaml', bundledDocument.yml());

  // validate the document
  const asyncApiDocument = readFileSync('bundled.yaml', 'utf-8')
  const parser = new Parser();
  const parse = await parser.parse(asyncApiDocument);
  const parseErrors = parse.diagnostics.filter((el) => {
    return el.severity == DiagnosticSeverity.Error;
  });
  if (parseErrors.length > 0) {
    const msg = parseErrors.map((err) => {
      return `${err.code}: ${err.message} [${err.path.join(' > ')}]`;
    });
    throw new Error(msg.join('\n'));
  }
}

main().catch((e) => console.error(e));
