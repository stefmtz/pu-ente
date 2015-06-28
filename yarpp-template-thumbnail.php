<?php
/*
YARPP Template: Thumbnails
Description: Custom Thumbnail template
Author: Stef
*/ ?>
<?php if (have_posts()):?>
<ol>
	<?php while (have_posts()) : the_post(); ?>
		<?php /*if (has_post_thumbnail()):?>
		<li><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_post_thumbnail(); ?></a></li>
		<?php endif;*/ ?>
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
						<a data-href="<?php the_permalink(); ?>"  href="<?php the_permalink(); ?>">
							<?php the_post_thumbnail( $size, $attr ); ?>
						</a>
					</div>
				</li>
	<?php endwhile; ?>
</ol>

<?php else: ?>
<?php endif; ?>
