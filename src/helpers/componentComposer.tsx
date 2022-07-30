import type { ComponentProps, JSXElementConstructor, ReactNode } from 'react';

export function component<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
	component: T,
	props?: Omit<ComponentProps<T>, 'children'>
) {
	return { component, props };
}

export default function ComponentComposer( { components, children }: {
	components: any[],
	children: ReactNode
} ) {
	return components.reduceRight( ( children, { component, props } ) => {
		const Component = component;
		return <Component {...props}>{children}</Component>;
	}, children );
}
