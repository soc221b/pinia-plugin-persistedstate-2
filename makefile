lint:
	pnpm prettier --write .

install:
	pnpm install

build:
	pnpm rollup -c rollup.config.js

test:
	pnpm jest --coverage

test-watch:
	pnpm jest --watch

clean:
	rm -rf /node_modules
	rm -rf /dist

release:
	make build
	pnpm standard-version

install-examples:
	node scripts/walk examples pnpm install

build-examples:
	node scripts/walk examples pnpm build

test-examples:
	pnpm jest --coverage ./examples

clean-examples:
	node scripts/walk examples rm -rf node_modules
	node scripts/walk examples rm -rf dist

check-size:
	npx size-limit
