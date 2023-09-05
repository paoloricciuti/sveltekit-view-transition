export class SetOfCallback<
	T,
	S extends (props: T) => void | Promise<void> = (props: T) => void | Promise<void>,
> extends Set<S> {}
