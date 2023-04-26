package com.repomon.rocketdan.domain.repo.service;

import com.repomon.rocketdan.common.GHUtils;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.dto.RepoListResponseDto;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.repository.ActiveRepoRepository;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import com.repomon.rocketdan.domain.repomon.repository.RepomonStatusRepository;
import com.repomon.rocketdan.domain.user.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Slf4j
@Transactional
@RequiredArgsConstructor
public class RepoService {

    private final GHUtils ghUtils;
    private final UserRepository userRepository;
    private final RepoRepository repoRepository;
    private final RepomonStatusRepository repomonStatusRepository;
    private final ActiveRepoRepository activeRepoRepository;

    public RepoListResponseDto getUserRepoList(Long userId, Pageable pageable){
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() ->{
            throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
        });

        String userName = userEntity.getUserName();
        Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(userName);

        saveAndUpdateRepo(repositories, userEntity);


        Page<ActiveRepoEntity> activeRepoPage = activeRepoRepository.findByUser(userEntity, pageable);
        List<RepoDetail> repoDetails = activeRepoPage.stream()
            .map(activeRepoEntity -> {
                RepoEntity repoEntity = activeRepoEntity.getRepo();
                GHRepository ghRepository = repositories.get(repoEntity.getRepoKey());
                return convertActiveRepoToRepo(activeRepoEntity, ghRepository);
            }).collect(Collectors.toList());

        long totalElements = activeRepoPage.getTotalElements();
        int totalPages = activeRepoPage.getTotalPages();
        return RepoListResponseDto.fromDetails(repoDetails, totalElements, totalPages);
    }

    private void saveAndUpdateRepo(Map<String, GHRepository> repositories, UserEntity userEntity) {
        repositories.forEach((s, ghRepository) -> {
            repoRepository.findByRepoKey(s).ifPresentOrElse(repoEntity -> repoEntity.update(ghRepository),
                () -> {
                    RepoEntity repoEntity = RepoEntity.fromGHRepository(ghRepository);
                    repoRepository.save(repoEntity);
                    activeRepoRepository.save(ActiveRepoEntity.of(userEntity, repoEntity));
                });
        });
    }

    private RepoDetail convertActiveRepoToRepo(ActiveRepoEntity activeRepoEntity, GHRepository ghRepository){
        RepoEntity repoEntity = activeRepoEntity.getRepo();
        return new RepoDetail(repoEntity
            , ghRepository == null ? "비공개 처리된 레포지토리입니다." : ghRepository.getDescription()
            , ghRepository == null);
    }
}
