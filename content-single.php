<?php
/**
 * @package Pu-ente
 */
?>
<!-- content-single.php -->
<article id="post-<?php the_ID();?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php //the_title( '<h1 class="entry-title">', '</h1>' ); ?>

		<div class="entry-meta">
			<?php //pu_ente_posted_on(); ?>
		</div><!-- .entry-meta -->
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php the_content(); ?>
		<div class="entry-text">
			<div id="project-title">
				<p><strong><?php the_title(); ?></strong>	</p>
				<?php $posttags = get_the_tags();
					if ($posttags) {
					  echo "<p>";
					  foreach($posttags as $tag) {
					    echo $tag->name . ' '; 
					  }
					  echo "</p>";
					} 
				?>
			</div>
			<div id="project-text">		
				<?php the_excerpt(); ?>	
			</div>
			<div class="clear"></div>
			
		</div>
		<div id="related-posts" >
			<?php related_posts(); ?>
		</div>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php //pu_ente_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
