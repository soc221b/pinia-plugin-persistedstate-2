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

check-size:
	npx size-limit
