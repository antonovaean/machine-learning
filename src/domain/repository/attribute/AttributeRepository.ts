import Attribute from 'domain/entity/attribute/Attribute';

export default abstract class AttributeRepository {
    public abstract generateAttributes(attributesAmount: number): Attribute[];

    public abstract getAttributes(): Attribute[];

    public abstract setAttributes(attributes: Attribute[]): void;
}
