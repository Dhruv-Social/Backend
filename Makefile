dev: 
	@npm run dev

clean:
	rm -rf build/

_build:
	@rm -rf ./build
	@npm run build

prod:
	@make _build
	node build/index.js