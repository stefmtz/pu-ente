<?php
/**
 * Template Name: Gallery
 * The template for displaying the galleries.
 *
 * @package Pu-ente
 */

get_header(); ?>
<!-- page-gallery.php -->
	<div id="primary" class="content-area">
		<main id="main" class="site-main clear" role="main">
		<?php
		global $post;
		$slug = get_post( $post )->post_name;
		$args = array( 'category_name' => $slug, 'order' => 'ASC' );

		$myposts = get_posts( $args );
		foreach ( $myposts as $post ) : setup_postdata( $post ); ?>
			<li class="project-container">
				<div class="project">
					<div class="project-description">
						<p><?php the_title(); ?></p>
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
					<a href="<?php the_permalink(); ?>">
						<?php the_post_thumbnail( $size, $attr ); ?>
					</a>
				</div>
			</li>
		<?php endforeach; ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
