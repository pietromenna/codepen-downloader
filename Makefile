test: test-cpen

test-complete: test-cpen test-connection

test-cpen:
	@echo ------- STARTING CPEN TESTS -------
	./node_modules/mocha/bin/mocha \
		test/cpenTest.js
	@echo ------- CPEN TESTS COMPLETED -------

test-connection:
	@echo ------- STARTING CONNETION TESTS -------
	./node_modules/mocha/bin/mocha \
		test/connectionTest.js
	@echo ------- CONNETION TESTS COMPELTED -------

.PHONY: test test-cpen test-connection test-complete
