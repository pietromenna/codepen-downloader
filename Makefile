test: test-cpen test-web

test-complete: test-cpen test-web test-connection

test-cpen:
	@echo ------- STARTING CPEN TESTS -------
	./node_modules/mocha/bin/mocha \
		test/cpenTest.js
	@echo ------- CPEN TESTS COMPLETED -------

test-web:
	@echo ------- STARTING WEB TESTS -------
	./node_modules/mocha/bin/mocha \
		test/webTest.js
	@echo ------- WEB TESTS COMPLETED -------

test-connection:
	@echo ------- STARTING CONNETION TESTS -------
	./node_modules/mocha/bin/mocha \
		test/connectionTest.js
	@echo ------- CONNETION TESTS COMPELTED -------

.PHONY: test test-cpen test-web test-connection test-complete
