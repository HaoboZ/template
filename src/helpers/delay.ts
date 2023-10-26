export function debounce<F extends (...args: Parameters<F>) => void>(fn: F, delay = 300) {
	let timer: ReturnType<typeof setTimeout>;

	return (...args: Parameters<F>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

export function throttle<F extends (...args: Parameters<F>) => void>(fn: F, delay = 300) {
	let ready = true;
	let _args: Parameters<F>;

	return (...args: Parameters<F>) => {
		_args = args;
		if (!ready) return;
		ready = false;
		setTimeout(() => {
			ready = true;
			fn(..._args);
		}, delay);
	};
}
