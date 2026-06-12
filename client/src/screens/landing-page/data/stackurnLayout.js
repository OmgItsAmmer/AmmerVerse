/** Even angular spacing on each ring; layers staggered so spokes don't line up */
export function buildStackurnLayouts(layers) {
    return layers.map((layer, layerIndex) => {
        const count = layer.logos.length;
        const ringOffset = (360 / Math.max(layers.length, 1)) * layerIndex * 1.25;

        const logos = layer.logos.map((logo, i) => ({
            ...logo,
            angle: (360 / count) * i - 90,
        }));

        return { layerId: layer.id, ringOffset, logos };
    });
}
