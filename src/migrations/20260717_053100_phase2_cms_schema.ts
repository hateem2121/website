import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`subheading\` text,
  	\`background_image_id\` integer,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_background_image_idx\` ON \`pages_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`width\` text DEFAULT 'normal',
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_order_idx\` ON \`pages_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_parent_id_idx\` ON \`pages_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_path_idx\` ON \`pages_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_image_idx\` ON \`pages_blocks_media_block\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_stats_order_idx\` ON \`pages_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_stats_parent_id_idx\` ON \`pages_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_order_idx\` ON \`pages_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_parent_id_idx\` ON \`pages_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stats_path_idx\` ON \`pages_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_timeline_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_entries_order_idx\` ON \`pages_blocks_timeline_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_entries_parent_id_idx\` ON \`pages_blocks_timeline_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_entries_image_idx\` ON \`pages_blocks_timeline_entries\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_order_idx\` ON \`pages_blocks_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_parent_id_idx\` ON \`pages_blocks_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_timeline_path_idx\` ON \`pages_blocks_timeline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_logo_marquee_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_logo_marquee\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_logos_order_idx\` ON \`pages_blocks_logo_marquee_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_logos_parent_id_idx\` ON \`pages_blocks_logo_marquee_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_logos_logo_idx\` ON \`pages_blocks_logo_marquee_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_logo_marquee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_order_idx\` ON \`pages_blocks_logo_marquee\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_parent_id_idx\` ON \`pages_blocks_logo_marquee\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_logo_marquee_path_idx\` ON \`pages_blocks_logo_marquee\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_by_persona_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	\`body\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_by_persona\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_by_persona_variants_order_idx\` ON \`pages_blocks_cta_by_persona_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_by_persona_variants_parent_id_idx\` ON \`pages_blocks_cta_by_persona_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_by_persona\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_by_persona_order_idx\` ON \`pages_blocks_cta_by_persona\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_by_persona_parent_id_idx\` ON \`pages_blocks_cta_by_persona\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_by_persona_path_idx\` ON \`pages_blocks_cta_by_persona\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_order_idx\` ON \`pages_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_parent_id_idx\` ON \`pages_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_seo_og_image_idx\` ON \`pages\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`subheading\` text,
  	\`background_image_id\` integer,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_background_image_idx\` ON \`_pages_v_blocks_hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_order_idx\` ON \`_pages_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_parent_id_idx\` ON \`_pages_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_path_idx\` ON \`_pages_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`width\` text DEFAULT 'normal',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_order_idx\` ON \`_pages_v_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_parent_id_idx\` ON \`_pages_v_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_path_idx\` ON \`_pages_v_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_image_idx\` ON \`_pages_v_blocks_media_block\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_stats_order_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_stats_parent_id_idx\` ON \`_pages_v_blocks_stats_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_order_idx\` ON \`_pages_v_blocks_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_parent_id_idx\` ON \`_pages_v_blocks_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stats_path_idx\` ON \`_pages_v_blocks_stats\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_timeline_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` text,
  	\`title\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_entries_order_idx\` ON \`_pages_v_blocks_timeline_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_entries_parent_id_idx\` ON \`_pages_v_blocks_timeline_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_entries_image_idx\` ON \`_pages_v_blocks_timeline_entries\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_order_idx\` ON \`_pages_v_blocks_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_parent_id_idx\` ON \`_pages_v_blocks_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_timeline_path_idx\` ON \`_pages_v_blocks_timeline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_logo_marquee_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_logo_marquee\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_logos_order_idx\` ON \`_pages_v_blocks_logo_marquee_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_logos_parent_id_idx\` ON \`_pages_v_blocks_logo_marquee_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_logos_logo_idx\` ON \`_pages_v_blocks_logo_marquee_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_logo_marquee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_order_idx\` ON \`_pages_v_blocks_logo_marquee\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_parent_id_idx\` ON \`_pages_v_blocks_logo_marquee\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_logo_marquee_path_idx\` ON \`_pages_v_blocks_logo_marquee\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_by_persona_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	\`body\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta_by_persona\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_by_persona_variants_order_idx\` ON \`_pages_v_blocks_cta_by_persona_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_by_persona_variants_parent_id_idx\` ON \`_pages_v_blocks_cta_by_persona_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_by_persona\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_by_persona_order_idx\` ON \`_pages_v_blocks_cta_by_persona\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_by_persona_parent_id_idx\` ON \`_pages_v_blocks_cta_by_persona\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_by_persona_path_idx\` ON \`_pages_v_blocks_cta_by_persona\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_order_idx\` ON \`_pages_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_parent_id_idx\` ON \`_pages_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_seo_meta_title\` text,
  	\`version_seo_meta_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_version_seo_og_image_idx\` ON \`_pages_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`body\` text,
  	\`author_label\` text,
  	\`published_date\` text,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_cover_idx\` ON \`posts\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_seo_seo_og_image_idx\` ON \`posts\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_body\` text,
  	\`version_author_label\` text,
  	\`version_published_date\` text,
  	\`version_seo_meta_title\` text,
  	\`version_seo_meta_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_cover_idx\` ON \`_posts_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_version_seo_og_image_idx\` ON \`_posts_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`case_studies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`anonymized_client\` text,
  	\`slug\` text,
  	\`sector\` text,
  	\`region\` text,
  	\`challenge\` text,
  	\`solution\` text,
  	\`results\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`case_studies_slug_idx\` ON \`case_studies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_updated_at_idx\` ON \`case_studies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_created_at_idx\` ON \`case_studies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies__status_idx\` ON \`case_studies\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_rels_order_idx\` ON \`case_studies_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_parent_idx\` ON \`case_studies_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_path_idx\` ON \`case_studies_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_media_id_idx\` ON \`case_studies_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_anonymized_client\` text,
  	\`version_slug\` text,
  	\`version_sector\` text,
  	\`version_region\` text,
  	\`version_challenge\` text,
  	\`version_solution\` text,
  	\`version_results\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_parent_idx\` ON \`_case_studies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_slug_idx\` ON \`_case_studies_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_updated_at_idx\` ON \`_case_studies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_created_at_idx\` ON \`_case_studies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version__status_idx\` ON \`_case_studies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_created_at_idx\` ON \`_case_studies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_updated_at_idx\` ON \`_case_studies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_latest_idx\` ON \`_case_studies_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_rels_order_idx\` ON \`_case_studies_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_rels_parent_idx\` ON \`_case_studies_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_rels_path_idx\` ON \`_case_studies_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_rels_media_id_idx\` ON \`_case_studies_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text,
  	\`order\` numeric NOT NULL,
  	\`hero_image_id\` integer,
  	\`intro\` text,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_hero_image_idx\` ON \`categories\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_seo_seo_og_image_idx\` ON \`categories\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_available_sizes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_available_sizes_order_idx\` ON \`products_available_sizes\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_available_sizes_parent_idx\` ON \`products_available_sizes\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_key_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_key_features_order_idx\` ON \`products_key_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_key_features_parent_id_idx\` ON \`products_key_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_colorways\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`swatch_hex\` text,
  	\`texture_set_key\` text,
  	\`poster_image_id\` integer,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_colorways_order_idx\` ON \`products_colorways\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_colorways_parent_id_idx\` ON \`products_colorways\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_colorways_poster_image_idx\` ON \`products_colorways\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`category_id\` integer,
  	\`short_description\` text,
  	\`long_description\` text,
  	\`fabric_composition\` text,
  	\`gsm\` numeric,
  	\`certifications_note\` text,
  	\`model3d_glb_file\` text,
  	\`model3d_file_size_k_b\` numeric,
  	\`model3d_pipeline_version\` text,
  	\`model3d_fallback_mode\` text DEFAULT 'coming-soon',
  	\`moq_starting_at\` numeric,
  	\`price_starting_at_u_s_d\` numeric,
  	\`show_teasers\` integer DEFAULT false,
  	\`moq_warning_override\` numeric,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_category_idx\` ON \`products\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`products_seo_seo_og_image_idx\` ON \`products\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_media_id_idx\` ON \`products_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_available_sizes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_available_sizes_order_idx\` ON \`_products_v_version_available_sizes\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_available_sizes_parent_idx\` ON \`_products_v_version_available_sizes\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_key_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_key_features_order_idx\` ON \`_products_v_version_key_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_key_features_parent_id_idx\` ON \`_products_v_version_key_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_colorways\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`swatch_hex\` text,
  	\`texture_set_key\` text,
  	\`poster_image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_colorways_order_idx\` ON \`_products_v_version_colorways\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_colorways_parent_id_idx\` ON \`_products_v_version_colorways\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_colorways_poster_image_idx\` ON \`_products_v_version_colorways\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_category_id\` integer,
  	\`version_short_description\` text,
  	\`version_long_description\` text,
  	\`version_fabric_composition\` text,
  	\`version_gsm\` numeric,
  	\`version_certifications_note\` text,
  	\`version_model3d_glb_file\` text,
  	\`version_model3d_file_size_k_b\` numeric,
  	\`version_model3d_pipeline_version\` text,
  	\`version_model3d_fallback_mode\` text DEFAULT 'coming-soon',
  	\`version_moq_starting_at\` numeric,
  	\`version_price_starting_at_u_s_d\` numeric,
  	\`version_show_teasers\` integer DEFAULT false,
  	\`version_moq_warning_override\` numeric,
  	\`version_seo_meta_title\` text,
  	\`version_seo_meta_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_category_idx\` ON \`_products_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_seo_version_seo_og_image_idx\` ON \`_products_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_rels_order_idx\` ON \`_products_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_parent_idx\` ON \`_products_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_path_idx\` ON \`_products_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_media_id_idx\` ON \`_products_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`fabric_library_allowed_fibres\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fibre\` text NOT NULL,
  	\`blendable\` integer DEFAULT true,
  	\`notes\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`fabric_library\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`fabric_library_allowed_fibres_order_idx\` ON \`fabric_library_allowed_fibres\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`fabric_library_allowed_fibres_parent_id_idx\` ON \`fabric_library_allowed_fibres\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`fabric_library\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`fabric_library_code_idx\` ON \`fabric_library\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`fabric_library_category_idx\` ON \`fabric_library\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`fabric_library_updated_at_idx\` ON \`fabric_library\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`fabric_library_created_at_idx\` ON \`fabric_library\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`buyers_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buyers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buyers_sessions_order_idx\` ON \`buyers_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buyers_sessions_parent_id_idx\` ON \`buyers_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`buyers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`country\` text NOT NULL,
  	\`phone\` text,
  	\`website\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`rejection_reason\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`_verified\` integer,
  	\`_verificationtoken\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`buyers_status_idx\` ON \`buyers\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`buyers_updated_at_idx\` ON \`buyers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`buyers_created_at_idx\` ON \`buyers\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`buyers_email_idx\` ON \`buyers\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`buyers_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`buyers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buyers_rels_order_idx\` ON \`buyers_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`buyers_rels_parent_idx\` ON \`buyers_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buyers_rels_path_idx\` ON \`buyers_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`buyers_rels_products_id_idx\` ON \`buyers_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_fibres\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`fibre\` text NOT NULL,
  	\`percentage\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_fibres_order_idx\` ON \`rfqs_styles_fibres\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_fibres_parent_id_idx\` ON \`rfqs_styles_fibres\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_certifications_requested\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_certifications_requested_order_idx\` ON \`rfqs_styles_certifications_requested\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_certifications_requested_parent_idx\` ON \`rfqs_styles_certifications_requested\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_branding_options\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_branding_options_order_idx\` ON \`rfqs_styles_branding_options\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_branding_options_parent_idx\` ON \`rfqs_styles_branding_options\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_colours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`colour\` text NOT NULL,
  	\`quantity\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_colours_order_idx\` ON \`rfqs_styles_colours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_colours_parent_id_idx\` ON \`rfqs_styles_colours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_sizes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text NOT NULL,
  	\`quantity\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_sizes_order_idx\` ON \`rfqs_styles_sizes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_sizes_parent_id_idx\` ON \`rfqs_styles_sizes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`filename\` text,
  	\`size_bytes\` numeric,
  	\`mime_type\` text,
  	\`scan_status\` text DEFAULT 'unscanned',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rfqs_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_files_order_idx\` ON \`rfqs_styles_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_files_parent_id_idx\` ON \`rfqs_styles_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs_styles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_ref_id\` integer,
  	\`category_id\` integer,
  	\`description\` text,
  	\`fabric_family_id\` integer,
  	\`branding_other\` text,
  	\`quantity\` numeric,
  	\`target_price\` numeric,
  	\`currency\` text DEFAULT 'USD',
  	FOREIGN KEY (\`product_ref_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`fabric_family_id\`) REFERENCES \`fabric_library\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rfqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rfqs_styles_order_idx\` ON \`rfqs_styles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_parent_id_idx\` ON \`rfqs_styles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_product_ref_idx\` ON \`rfqs_styles\` (\`product_ref_id\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_category_idx\` ON \`rfqs_styles\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_styles_fabric_family_idx\` ON \`rfqs_styles\` (\`fabric_family_id\`);`)
  await db.run(sql`CREATE TABLE \`rfqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reference_number\` text,
  	\`source\` text DEFAULT 'guest' NOT NULL,
  	\`buyer_id\` integer,
  	\`submitted_at\` text,
  	\`name\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`country\` text NOT NULL,
  	\`request_type\` text DEFAULT 'bulk' NOT NULL,
  	\`consents_processing_consent\` integer DEFAULT false NOT NULL,
  	\`consents_processing_consent_at\` text,
  	\`consents_consent_policy_version\` text,
  	\`consents_marketing_opt_in\` integer DEFAULT false,
  	\`consents_marketing_double_opt_in_required\` integer DEFAULT false,
  	\`consents_marketing_double_opt_in_confirmed_at\` text,
  	\`consents_consent_source\` text,
  	\`attribution_utm_source\` text,
  	\`attribution_utm_medium\` text,
  	\`attribution_utm_campaign\` text,
  	\`attribution_utm_term\` text,
  	\`attribution_utm_content\` text,
  	\`attribution_landing_page\` text,
  	\`attribution_referrer\` text,
  	\`status\` text DEFAULT 'new',
  	\`assignee_id\` integer,
  	\`follow_up_date\` text,
  	\`internal_notes\` text,
  	\`outcome\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`buyer_id\`) REFERENCES \`buyers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`assignee_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`rfqs_reference_number_idx\` ON \`rfqs\` (\`reference_number\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_buyer_idx\` ON \`rfqs\` (\`buyer_id\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_status_idx\` ON \`rfqs\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_assignee_idx\` ON \`rfqs\` (\`assignee_id\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_updated_at_idx\` ON \`rfqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rfqs_created_at_idx\` ON \`rfqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`filename\` text,
  	\`size_bytes\` numeric,
  	\`mime_type\` text,
  	\`scan_status\` text DEFAULT 'unscanned',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_files_order_idx\` ON \`inquiries_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_files_parent_id_idx\` ON \`inquiries_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`company\` text,
  	\`country\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`consents_processing_consent\` integer DEFAULT false NOT NULL,
  	\`consents_processing_consent_at\` text,
  	\`consents_consent_policy_version\` text,
  	\`consents_marketing_opt_in\` integer DEFAULT false,
  	\`consents_marketing_double_opt_in_required\` integer DEFAULT false,
  	\`consents_marketing_double_opt_in_confirmed_at\` text,
  	\`consents_consent_source\` text,
  	\`attribution_utm_source\` text,
  	\`attribution_utm_medium\` text,
  	\`attribution_utm_campaign\` text,
  	\`attribution_utm_term\` text,
  	\`attribution_utm_content\` text,
  	\`attribution_landing_page\` text,
  	\`attribution_referrer\` text,
  	\`status\` text DEFAULT 'new',
  	\`internal_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_status_idx\` ON \`inquiries\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_order_idx\` ON \`site_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_parent_id_idx\` ON \`site_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`whatsapp_number\` text DEFAULT '+00-000-0000000',
  	\`whatsapp_enabled\` integer DEFAULT false,
  	\`emails_partner\` text DEFAULT 'partner@wear-run.help',
  	\`emails_info\` text DEFAULT 'info@wear-run.help',
  	\`emails_privacy\` text DEFAULT 'privacy@wear-run.help',
  	\`address\` text,
  	\`response_promise\` text DEFAULT 'within 2 business days',
  	\`moq_warning_default\` numeric DEFAULT 250,
  	\`show_moq_publicly\` integer DEFAULT false,
  	\`announcement_enabled\` integer DEFAULT false,
  	\`announcement_text\` text,
  	\`announcement_href\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`exclusion_list_countries\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`exclusion_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exclusion_list_countries_order_idx\` ON \`exclusion_list_countries\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`exclusion_list_countries_parent_idx\` ON \`exclusion_list_countries\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`exclusion_list\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`polite_message\` text DEFAULT 'Thank you for your interest in RUN APPAREL. We''re currently unable to take on new partnerships in {country}, so this form can''t be submitted for that market. We appreciate your understanding.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`navigation_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_children_order_idx\` ON \`navigation_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_children_parent_id_idx\` ON \`navigation_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_order_idx\` ON \`navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_parent_id_idx\` ON \`navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_columns_links_order_idx\` ON \`footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_links_parent_id_idx\` ON \`footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_columns_order_idx\` ON \`footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_columns_parent_id_idx\` ON \`footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`legal_line\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`case_studies_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	\`fabric_library_id\` integer,
  	\`buyers_id\` integer,
  	\`rfqs_id\` integer,
  	\`inquiries_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`case_studies_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`fabric_library_id\`) REFERENCES \`fabric_library\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`buyers_id\`) REFERENCES \`buyers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rfqs_id\`) REFERENCES \`rfqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id", "case_studies_id", "media_id", "categories_id", "products_id", "fabric_library_id", "buyers_id", "rfqs_id", "inquiries_id", "users_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id", "case_studies_id", "media_id", "categories_id", "products_id", "fabric_library_id", "buyers_id", "rfqs_id", "inquiries_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_case_studies_id_idx\` ON \`payload_locked_documents_rels\` (\`case_studies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_fabric_library_id_idx\` ON \`payload_locked_documents_rels\` (\`fabric_library_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_buyers_id_idx\` ON \`payload_locked_documents_rels\` (\`buyers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rfqs_id_idx\` ON \`payload_locked_documents_rels\` (\`rfqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`buyers_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`buyers_id\`) REFERENCES \`buyers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_preferences_rels\`("id", "order", "parent_id", "path", "buyers_id", "users_id") SELECT "id", "order", "parent_id", "path", "buyers_id", "users_id" FROM \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_preferences_rels\` RENAME TO \`payload_preferences_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_buyers_id_idx\` ON \`payload_preferences_rels\` (\`buyers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  // ---------------------------------------------------------------------------
  // HAND-EDITED — do not regenerate this block away. Two defects in the generated
  // version, both fatal to the existing production admin account:
  //
  // 1. The generator emitted `ADD \`name\` text NOT NULL` with no default. SQLite
  //    rejects that outright on a table that already holds rows ("Cannot add a NOT
  //    NULL column with default value NULL"), so the whole migration would abort.
  //    A default is therefore required. Payload always supplies `name` on write, so
  //    the default is only ever consumed by this backfill.
  //
  // 2. `role` defaults to 'editor' — correct for NEW accounts (least privilege),
  //    wrong for the account that already exists. Without the UPDATE below, the
  //    owner's login would survive the migration but silently lose the ability to
  //    manage buyers, RFQs and settings, because every admin-only rule checks
  //    `role === 'admin'`.
  // ---------------------------------------------------------------------------
  await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text NOT NULL DEFAULT 'Admin';`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'editor' NOT NULL;`)

  // Every row predating this migration is staff from before roles existed — i.e. the
  // owner's account (BUILD_LOG 2026-07-15 verified production held exactly 1 user).
  // On a fresh database this matches zero rows and is a no-op.
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_timeline_entries\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_timeline\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_marquee_logos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_logo_marquee\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_by_persona_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_by_persona\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_timeline_entries\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_timeline\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_marquee_logos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_logo_marquee\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_by_persona_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_by_persona\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`case_studies\`;`)
  await db.run(sql`DROP TABLE \`case_studies_rels\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_rels\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`products_available_sizes\`;`)
  await db.run(sql`DROP TABLE \`products_key_features\`;`)
  await db.run(sql`DROP TABLE \`products_colorways\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_available_sizes\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_key_features\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_colorways\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`_products_v_rels\`;`)
  await db.run(sql`DROP TABLE \`fabric_library_allowed_fibres\`;`)
  await db.run(sql`DROP TABLE \`fabric_library\`;`)
  await db.run(sql`DROP TABLE \`buyers_sessions\`;`)
  await db.run(sql`DROP TABLE \`buyers\`;`)
  await db.run(sql`DROP TABLE \`buyers_rels\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_fibres\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_certifications_requested\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_branding_options\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_colours\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_sizes\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles_files\`;`)
  await db.run(sql`DROP TABLE \`rfqs_styles\`;`)
  await db.run(sql`DROP TABLE \`rfqs\`;`)
  await db.run(sql`DROP TABLE \`inquiries_files\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`site_settings_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`exclusion_list_countries\`;`)
  await db.run(sql`DROP TABLE \`exclusion_list\`;`)
  await db.run(sql`DROP TABLE \`navigation_items_children\`;`)
  await db.run(sql`DROP TABLE \`navigation_items\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`footer_columns\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_preferences_rels\`("id", "order", "parent_id", "path", "users_id") SELECT "id", "order", "parent_id", "path", "users_id" FROM \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_preferences_rels\` RENAME TO \`payload_preferences_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
