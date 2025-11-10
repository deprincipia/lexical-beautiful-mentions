import { LexicalNodeReplacement } from "lexical";
import { ElementType } from "react";
import { BeautifulMentionComponentProps } from "./BeautifulMentionsPluginProps";
import { BeautifulMentionNode } from "./MentionNode";
export type CustomBeautifulMentionNodeClass = typeof BeautifulMentionNode;
export declare let CustomBeautifulMentionNode: CustomBeautifulMentionNodeClass;
export declare function setCustomBeautifulMentionNode(BeautifulMentionNodeClass: CustomBeautifulMentionNodeClass): void;
/**
 * Instead of using the default `BeautifulMentionNode` class, you can
 * extend it and use the mention component of your choice.
 */
export declare function createBeautifulMentionNode(mentionComponent: ElementType<BeautifulMentionComponentProps>): [CustomBeautifulMentionNodeClass, LexicalNodeReplacement];
