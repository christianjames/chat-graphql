<?php

namespace Drupal\taller_chat_user\Plugin\GraphQL\Mutations;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Flood\FloodInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\user\UserAuthInterface;
use Drupal\user\UserInterface;
use Drupal\graphql\Plugin\GraphQL\Mutations\MutationPluginBase;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Youshido\GraphQL\Execution\ResolveInfo;

/**
 * Logout User.
 *
 * @GraphQLMutation(
 *   id = "user_logout",
 *   name = "userLogout",
 *   type = "User",
 *   secure = false,
 *   nullable = true,
 *   schema_cache_tags = {"user_logout"},
 *   arguments = {}
 * )
 */
class UserLogout extends MutationPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;
  use StringTranslationTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  // @TODO Create a Trait for the user's methods.

  /**
   * The user authentication.
   *
   * @var \Drupal\user\UserAuthInterface
   */
  protected $userAuth;

  /**
   * The flood controller.
   *
   * @var \Drupal\Core\Flood\FloodInterface
   */
  protected $flood;

  /**
   * The current user service.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $pluginId,
    $pluginDefinition,
    EntityTypeManagerInterface $entityTypeManager,
    FloodInterface $flood,
    UserAuthInterface $user_auth,
    ConfigFactoryInterface $configFactory,
    AccountInterface $currentUser
  ) {
    $this->entityTypeManager = $entityTypeManager;
    $this->flood = $flood;
    $this->userAuth = $user_auth;
    $this->configFactory = $configFactory;
    $this->currentUser = $currentUser;

    parent::__construct($configuration, $pluginId, $pluginDefinition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $pluginId, $pluginDefinition) {
    return new static(
      $configuration,
      $pluginId,
      $pluginDefinition,
      $container->get('entity_type.manager'),
      $container->get('flood'),
      $container->get('user.auth'),
      $container->get('config.factory'),
      $container->get('current_user')
    );
  }

  /**
   * Logs in a user.   *
   */
  public function resolve($value, array $args, ResolveInfo $info) {
    return $this->logout(\Drupal::request(), $args);
  }

  /**
   * Logout a user.
   *
   */
  public function logout() {
    if (!$this->currentUser->isAuthenticated()) {
      throw new BadRequestHttpException($this->t('The user is not logged in.'));
    }

    user_logout();
  }
}
